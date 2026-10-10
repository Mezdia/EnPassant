import classes from "./MobileBoardLayout.module.css";

/**
 * Fixed, orientation-aware replacement for the desktop react-mosaic tiling,
 * used on mobile for the Analysis / Play / Puzzle screens.
 *
 * The regions follow the reference app's arrangement:
 *
 *   #mobileTopStrip    → the game screen's horizontal move strip
 *   #mobileEngineLines → the engine's best-line strip above the board
 *   #left              → player strips + chessboard + eval gauge
 *   #bottomRight       → legacy notation column; empty on Analysis/Play, still
 *                        used by the puzzle screen
 *   #topRight          → the tabbed panel area
 *   #mobileBottomBar   → the 56px action bar (menu / flip / prev / next …)
 *
 * Orientation is a CSS grid change over one DOM tree. Branching the JSX on
 * `useIsLandscape()` instead recreates the portal targets on rotation, and
 * Mantine's <Portal> resolves its `target` once — every board screen would then
 * render into detached nodes and the whole tab goes blank.
 */
export function MobileBoardLayout() {
  return (
    <div className={classes.root}>
      <div className={classes.shell}>
        <div id="mobileTopStrip" className={classes.strip} />
        <div id="mobileEngineLines" className={classes.lines} />
        <div id="left" className={classes.board} />
        <div id="bottomRight" className={classes.legacy} />
        <div id="topRight" className={classes.panels} />
        <div id="mobileBottomBar" className={classes.bar} />
      </div>
    </div>
  );
}
