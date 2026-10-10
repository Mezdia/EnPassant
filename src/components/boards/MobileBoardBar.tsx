import { Text } from "@mantine/core";
import type { BoardBarProps } from "./BoardBar";
import classes from "./MobileBoardBar.module.css";

/**
 * Portrait-phone form of the board bar.
 *
 * Each name sits in the screen corner nearest its own pieces: the side in focus
 * at the bottom start, the opponent at the top end. The corners are addressed
 * with logical flex values, so an RTL locale mirrors them on its own. The row
 * takes its height from the caption instead of from the desktop bar's fixed
 * height, which is what lets the name sit against the board.
 */
export function MobileBoardBar({
  name,
  rating,
  onNameClick,
  children,
}: Omit<BoardBarProps, "height">) {
  return (
    <div className={classes.bar}>
      <div className={classes.identity}>
        <Text size="xs" fw={600} c="dimmed" className={classes.name} onClick={onNameClick}>
          {name !== "?" && name}
        </Text>
        {rating && (
          <Text size="xs" c="dimmed" className={classes.rating}>
            ({rating})
          </Text>
        )}
      </div>
      <div className={classes.status}>{children}</div>
    </div>
  );
}
