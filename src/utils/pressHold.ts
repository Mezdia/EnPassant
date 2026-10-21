import {
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
    useEffect,
    useRef,
} from "react";

/**
 * Press-and-hold auto-repeat for the phone's move steppers, like the
 * reference app's rewind/forward. Spread the returned props onto an
 * ActionIcon:
 *
 * - a tap fires the callback on pointer-down, for instant feedback;
 * - holding starts a auto-repeat after a short delay;
 * - the synthetic click that follows pointer-up is always swallowed, so a
 *   tap never fires twice.
 *
 * The callback may return false to stop an ongoing repeat early — e.g. when
 * the move list reaches its end — instead of letting the interval no-op.
 */
export function usePressHold(callback: () => boolean | void) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const holdingRef = useRef(false);
    const timers = useRef<{ timeout?: number; interval?: number }>({});

    const stopRepeat = () => {
        window.clearTimeout(timers.current.timeout);
        window.clearInterval(timers.current.interval);
        timers.current.timeout = undefined;
        timers.current.interval = undefined;
    };

    useEffect(() => stopRepeat, []);

    // Returns false when the callback signals the repeat should stop.
    const fire = () => callbackRef.current() !== false;

    const onPointerDown = (event: ReactPointerEvent) => {
        if (event.button !== 0) return;
        holdingRef.current = false;
        fire();
        timers.current.timeout = window.setTimeout(() => {
            holdingRef.current = true;
            if (!fire()) return;
            timers.current.interval = window.setInterval(() => {
                if (!fire()) stopRepeat();
            }, 120);
        }, 350);
    };

    return {
        onPointerDown,
        onPointerUp: stopRepeat,
        onPointerCancel: stopRepeat,
        onPointerLeave: stopRepeat,
        onContextMenu: (event: ReactMouseEvent) => {
            // Long-pressing in a WebView opens the text-selection context menu;
            // cancel it so holding the stepper stays usable.
            if (holdingRef.current) event.preventDefault();
        },
        onClick: (event: ReactMouseEvent) => {
            // A tap already fired on pointer-down; the follow-up click is always
            // redundant, so swallow it.
            event.preventDefault();
            event.stopPropagation();
            holdingRef.current = false;
        },
    };
}
