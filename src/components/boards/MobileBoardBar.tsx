import { Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { currentTabAtom } from "@/state/atoms";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import type { BoardBarProps } from "./BoardBar";
import classes from "./MobileBoardBar.module.css";

/**
 * Phone form of the board bar, shaped after the reference app.
 *
 * Analysis: a 26px strip glued to the board column — name and rating at the
 * start, clock and material at the end. Play: a taller table that absorbs the
 * height the board leaves over, with the clock grown to the reference app's
 * size. The tab type decides which one, so Board.tsx keeps a single call site.
 */
export function MobileBoardBar({
  name,
  rating,
  onNameClick,
  children,
}: Omit<BoardBarProps, "height">) {
  const tab = useAtomValue(currentTabAtom);
  // Only a portrait game has height to hand out to the tables; in landscape the
  // board is already squeezed for height, so both screens keep the slim strip.
  const table = useIsMobilePortrait() && tab?.type === "play";

  return (
    <div className={table ? classes.table : classes.strip}>
      <div className={classes.identity}>
        <Text fw={table ? 600 : "bold"} className={classes.name} onClick={onNameClick}>
          {name !== "?" && name}
        </Text>
        {rating != null && rating !== "" && (
          <Text size="sm" c="dimmed">
            ({rating})
          </Text>
        )}
      </div>
      {children != null && <div className={classes.status}>{children}</div>}
    </div>
  );
}
