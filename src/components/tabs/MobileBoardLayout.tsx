import cx from "clsx";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIsLandscape } from "@/utils/useIsLandscape";
import classes from "./MobileBoardLayout.module.css";

/**
 * Fixed, orientation-aware replacement for the desktop react-mosaic tiling,
 * used on mobile for the Analysis / Play / Puzzle screens.
 *
 * It renders the same three portal targets the board screens portal into:
 *   #left        → the chessboard
 *   #bottomRight → eval bar + move notation + controls
 *   #topRight    → the tabbed panels (Analysis / Database / Annotate / Info…)
 *
 * Portrait: board + notation fill the screen; the panels live in a draggable
 * collapsible bottom sheet (peek / half / full) that can be pulled down to
 * maximise the board. Landscape: board + notation on the left, panels on the
 * right (mirrors the desktop layout).
 */

// Sheet snap points as a fraction of the container height.
const SNAP_POINTS: readonly number[] = [0.12, 0.5, 0.88];
const PEEK = SNAP_POINTS[0];
const MAX_FRACTION = SNAP_POINTS[SNAP_POINTS.length - 1];

const clamp = (f: number) => Math.min(MAX_FRACTION, Math.max(PEEK, f));

/** Nearest snap point to `f`. */
function snapNearest(f: number) {
  let best = SNAP_POINTS[0];
  let bestDist = Math.abs(f - best);
  for (const p of SNAP_POINTS) {
    const d = Math.abs(f - p);
    if (d < bestDist) {
      best = p;
      bestDist = d;
    }
  }
  return best;
}

/**
 * How far the portrait bottom sheet is open, as a fraction of the viewport.
 *
 * Kept in an atom rather than local state so board screens can open it when the
 * panel — not the board — is the thing the user came for (the Play setup wizard
 * is a whole form, useless at the 12% peek height). They reach the sheet through
 * a portal, so there is no prop path from here to them.
 */
export const mobileSheetFractionAtom = atom<number>(PEEK);

/** Snap point constants for callers that want to open/collapse the sheet. */
export const SHEET_PEEK = PEEK;
export const SHEET_HALF = SNAP_POINTS[1];
export const SHEET_FULL = MAX_FRACTION;

/**
 * Holds the portrait sheet open at `fraction` while `enabled`, collapsing back
 * to the peek height afterwards. Harmless on desktop and in landscape, where
 * nothing reads the atom.
 */
export function useMobileSheetOpen(fraction: number, enabled = true) {
  const setFraction = useSetAtom(mobileSheetFractionAtom);
  useEffect(() => {
    if (!enabled) return;
    setFraction(fraction);
    return () => setFraction(PEEK);
  }, [enabled, fraction, setFraction]);
}

export function MobileBoardLayout() {
  const landscape = useIsLandscape();

  if (landscape) {
    return (
      <div className={classes.root}>
        <div className={classes.landscape}>
          <div className={classes.landscapeLeft}>
            <div id="left" className={classes.landscapeBoard} style={{ height: "100%" }} />
            <div id="bottomRight" className={classes.landscapeNotation} />
          </div>
          <div id="topRight" className={classes.landscapeRight} style={{ height: "100%" }} />
        </div>
      </div>
    );
  }

  return <PortraitLayout />;
}

function PortraitLayout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [fraction, setFraction] = useAtom(mobileSheetFractionAtom);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{ startY: number; startFraction: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragState.current = { startY: e.clientY, startFraction: fraction };
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [fraction],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragState.current;
      const root = rootRef.current;
      if (!drag || !root) return;
      const h = root.clientHeight;
      if (h === 0) return;
      // Dragging up (negative dy) grows the sheet.
      const dy = e.clientY - drag.startY;
      setFraction(clamp(drag.startFraction - dy / h));
    },
    [setFraction],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      dragState.current = null;
      setDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      setFraction((f) => snapNearest(f));
    },
    [setFraction],
  );

  return (
    <div className={classes.root} ref={rootRef}>
      <div className={classes.portrait} style={{ paddingBottom: `${PEEK * 100}%` }}>
        <div id="left" className={classes.portraitBoard} />
        <div id="bottomRight" className={classes.portraitNotation} />
      </div>
      <div
        className={cx(classes.sheet, dragging ? classes.dragging : classes.sheetAnimated)}
        style={{ height: `${fraction * 100}%` }}
      >
        <div
          className={classes.handleZone}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className={classes.handle} />
        </div>
        <div id="topRight" className={classes.sheetBody} />
      </div>
    </div>
  );
}
