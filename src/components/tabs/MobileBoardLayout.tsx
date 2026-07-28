import { useCallback, useRef, useState } from "react";
import cx from "clsx";
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
  const [fraction, setFraction] = useState<number>(PEEK);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{ startY: number; startFraction: number } | null>(null);

  const clamp = (f: number) => Math.min(MAX_FRACTION, Math.max(PEEK, f));

  const snapNearest = useCallback((f: number) => {
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
  }, []);

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
    [clamp],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      dragState.current = null;
      setDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      setFraction((f) => snapNearest(f));
    },
    [snapNearest],
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
