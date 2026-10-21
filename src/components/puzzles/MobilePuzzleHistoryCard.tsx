import { Paper, ScrollArea } from "@mantine/core";
import type { Puzzle } from "@/utils/puzzles";
import ChallengeHistory from "../common/ChallengeHistory";

/**
 * The capped history card. Shared by the landscape column and the stats
 * sheet, so the completion dots stay the only per-puzzle UI outside the
 * board.
 */
export function MobilePuzzleHistoryCard({
  puzzles,
  current,
  select,
}: {
  puzzles: Puzzle[];
  current: number;
  select: (i: number) => void;
}) {
  const challenges = puzzles.map((p) => ({
    ...p,
    label: p.rating?.toString() ?? "-",
  }));

  return (
    <Paper withBorder p="xs">
      <ScrollArea.Autosize mah={110} offsetScrollbars>
        <ChallengeHistory challenges={challenges} current={current} select={select} />
      </ScrollArea.Autosize>
    </Paper>
  );
}
