import { useAtomValue } from "jotai";
import { currentTabAtom } from "@/state/atoms";
import { mobileSmallBoardAtom } from "@/state/mobileAtoms";
import classes from "./MobileBoardLayout.module.css";

/**
 * Fixed, orientation-aware replacement for the desktop react-mosaic tiling,
 * used on mobile for the Analysis / Play / Puzzle screens.
 *
 * The regions follow the reference app's arrangement:
 *
 *   #mobileTopStrip    → the game screen's horizontal move strip
 *   #left              → player strips + chessboard + eval gauge
 *   #bottomRight       → legacy notation column; empty on Analysis/Play, still
 *                        used by the puzzle screen
 *   #topRight          → the tabbed panel area
 *   #mobileBottomBar   → the 56px action bar (menu / flip / prev / next …)
 *
 * The engine-line strip that used to live above the board is gone — the
 * EvalBar gauge on the board's end edge is the single eval surface, and the
 * lines live in the Analysis panel tab.
 *
 * Orientation is a CSS grid change over one DOM tree. Branching the JSX on
 * `useIsLandscape()` instead recreates the portal targets on rotation, and
 * Mantine's <Portal> resolves its `target` once — every board screen would then
 * render into detached nodes and the whole tab goes blank.
 */
export function MobileBoardLayout() {
  const currentTab = useAtomValue(currentTabAtom);
  // The board-size toggle is an analysis tool, like the reference app's; a
  // live game always keeps its full-size board.
  const smallBoard = useAtomValue(mobileSmallBoardAtom) && currentTab?.type === "analysis";

  return (
    <div className={classes.root}>
      <div className={classes.shell} data-small-board={smallBoard || undefined}>
        <div id="mobileTopStrip" className={classes.strip} />
        <div id="left" className={classes.board} />
        <div id="bottomRight" className={classes.legacy} />
        <div id="topRight" className={classes.panels} />
        <div id="mobileBottomBar" className={classes.bar} />
      </div>
    </div>
  );
}
