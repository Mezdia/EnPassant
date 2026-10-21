import { ActionIcon, Badge, Button, Group, Stack, Text } from "@mantine/core";
import {
  IconBulb,
  IconCircleCheck,
  IconCircleDot,
  IconCircleX,
  IconEye,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import type { Completion } from "@/utils/puzzles";
import { formatThemeLabel } from "@/utils/format";

interface MobilePuzzleFeedbackProps {
  turnToMove: "white" | "black" | null;
  playingSolution: boolean;
  completion: Completion | undefined;
  /** Shown as badges once the puzzle is solved, like the reference training. */
  themes: string[];
  onHint: () => void;
  hintDisabled: boolean;
  onViewSolution: () => void;
  solutionDisabled: boolean;
}

/**
 * The reference training strip: one state line under the board — whose turn
 * it is mid-solve, then solved/failed once done — a hint icon at the far end,
 * and the fat view-solution button under the strip.
 */
export function MobilePuzzleFeedback({
  turnToMove,
  playingSolution,
  completion,
  themes,
  onHint,
  hintDisabled,
  onViewSolution,
  solutionDisabled,
}: MobilePuzzleFeedbackProps) {
  const { t } = useTranslation();

  const solved = !playingSolution && completion === "correct";
  const wrong = !playingSolution && completion === "incorrect";
  const active = !solved && !wrong && !playingSolution;

  const state = match({ active, solved, wrong })
    .with({ active: true }, () => ({
      icon: <IconCircleDot size="1.25rem" />,
      title: t("Puzzle.Mobile.YourTurn"),
      sub: turnToMove
        ? turnToMove === "white"
          ? t("Puzzle.Mobile.FindBestMoveWhite")
          : t("Puzzle.Mobile.FindBestMoveBlack")
        : null,
      state: "turn" as const,
    }))
    .with({ solved: true }, () => ({
      icon: <IconCircleCheck size="1.25rem" />,
      title: t("Puzzle.Mobile.Solved"),
      sub: null,
      state: "solved" as const,
    }))
    .with({ wrong: true }, () => ({
      icon: <IconCircleX size="1.25rem" />,
      title: t("Puzzle.Mobile.Wrong"),
      sub: null,
      state: "wrong" as const,
    }))
    .otherwise(() => ({
      icon: <IconEye size="1.25rem" />,
      title: t("Puzzle.Mobile.PlayingSolution"),
      sub: null,
      state: "solution" as const,
    }));

  return (
    <Stack gap={4} p="xs">
      {state.state === "solved" && themes.length > 0 && (
        <Group gap={4} wrap="wrap">
          {themes.map((theme) => (
            <Badge key={theme} variant="light" size="sm">
              {formatThemeLabel(theme)}
            </Badge>
          ))}
        </Group>
      )}
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group
          gap="xs"
          wrap="nowrap"
          style={{ flex: 1, minWidth: 0 }}
          c={state.state === "solved" ? "teal" : state.state === "wrong" ? "red" : undefined}
        >
          <ActionIcon
            variant="subtle"
            color={state.state === "solved" ? "teal" : state.state === "wrong" ? "red" : "gray"}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: "none" }}
          >
            {state.icon}
          </ActionIcon>
          <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
            <Text fz="sm" fw={600} lh={1.2}>
              {state.title}
            </Text>
            {state.sub && (
              <Text fz="xs" c="dimmed" lh={1.2} truncate>
                {state.sub}
              </Text>
            )}
          </Stack>
        </Group>
        {active && (
          <ActionIcon
            variant="default"
            onClick={onHint}
            disabled={hintDisabled}
            aria-label={t("Puzzle.GetAHint")}
          >
            <IconBulb size="1.1rem" />
          </ActionIcon>
        )}
      </Group>
      <Button
        variant="light"
        fullWidth
        disabled={solutionDisabled || playingSolution}
        onClick={onViewSolution}
        size="compact-sm"
      >
        {t("Puzzle.ViewSolution")}
      </Button>
    </Stack>
  );
}
