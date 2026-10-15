import { BarChart } from "@mantine/charts";
import { Button, Drawer, Group, Paper, Stack, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { skipWhile, takeWhile } from "@/utils/misc";
import { type TreeNode, treeIteratorMainLine } from "@/utils/treeReducer";
import { TreeStateContext } from "../common/TreeStateContext";

/**
 * Post-game move-times chart for the phone Game screen (D5, owner-authorized).
 * Reads the per-node `clock` (seconds left after each move) that the game
 * path already stores via mapBackendMoves → tree sync — no new backend data.
 * Time per move is the clock delta; because time increments are not carried
 * per node, a move that gained time renders as 0. UI-only, reuses
 * @mantine/charts like the desktop EvalChart.
 */
export function MobileMoveTimes() {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const store = useContext(TreeStateContext)!;
  const root = useStore(store, (s) => s.root);

  const rows = buildMoveTimes(root);
  const hasData = rows.some((r) => r.White !== null || r.Black !== null);

  return (
    <>
      <Button
        variant="default"
        size="md"
        leftSection={<IconClock size="1.1rem" />}
        onClick={() => setOpened(true)}
        disabled={!hasData}
      >
        {t("Board.Mobile.MoveTimes")}
      </Button>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        withCloseButton
        title={t("Board.Mobile.MoveTimes")}
      >
        {hasData ? (
          <Stack gap="sm">
            <SummaryRow rows={rows} />
            <BarChart
              h={200}
              data={rows.map((r) => ({
                name: `${r.move}`,
                White: r.White ?? 0,
                Black: r.Black ?? 0,
              }))}
              dataKey="name"
              series={[
                { name: "White", color: "white" },
                { name: "Black", color: "gray.8" },
              ]}
              tickLine="none"
              withLegend
              legendProps={{ verticalAlign: "top" }}
            />
          </Stack>
        ) : (
          <Text fz="sm" c="dimmed">
            {t("Board.Mobile.NoMoveTimes")}
          </Text>
        )}
      </Drawer>
    </>
  );
}

type MoveRow = { move: number; White: number | null; Black: number | null };

function buildMoveTimes(root: TreeNode): MoveRow[] {
  const nodes = [
    ...takeWhile(
      skipWhile(treeIteratorMainLine(root), (n) => n.position.length === 0),
      (n) => n.node.move !== undefined,
    ),
  ];

  const rows: MoveRow[] = [];
  let prevClock: number | null = null;
  for (const { node } of nodes) {
    const moveNo = Math.ceil(node.halfMoves / 2);
    const whiteMoved = node.halfMoves % 2 === 1;
    const clock = node.clock ?? null;
    const spent = prevClock !== null && clock !== null ? Math.max(0, prevClock - clock) : null;
    prevClock = clock ?? prevClock;

    let row = rows[rows.length - 1];
    if (!row || row.move !== moveNo) {
      row = { move: moveNo, White: null, Black: null };
      rows.push(row);
    }
    if (whiteMoved) row.White = spent;
    else row.Black = spent;
  }
  return rows;
}

function SummaryRow({ rows }: { rows: MoveRow[] }) {
  const { t } = useTranslation();
  const stats = (side: "White" | "Black") => {
    const vals = rows.map((r) => r[side]).filter((v): v is number => v !== null && v > 0);
    if (vals.length === 0) return null;
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const max = Math.max(...vals);
    return { avg, max };
  };
  return (
    <Group gap="xs" wrap="nowrap" justify="space-between">
      {(["White", "Black"] as const).map((side) => {
        const s = stats(side);
        return (
          <Paper key={side} withBorder px="sm" py={4} style={{ flex: 1, minWidth: 0 }}>
            <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
              {side === "White" ? t("Common.WHITE") : t("Common.BLACK")}
            </Text>
            <Text fz="xs">
              {s
                ? `${t("Board.Mobile.Avg")} ${formatSeconds(s.avg)} · ${t("Board.Mobile.Longest")} ${formatSeconds(s.max)}`
                : "—"}
            </Text>
          </Paper>
        );
      })}
    </Group>
  );
}

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default MobileMoveTimes;
