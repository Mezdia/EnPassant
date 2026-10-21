import { ActionIcon, Drawer, Group } from "@mantine/core";
import {
  IconChartArea,
  IconChevronsLeft,
  IconChevronsRight,
  IconPlus,
  IconZoomCheck,
} from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePressHold } from "@/utils/pressHold";
import type { PuzzleDatabaseInfo } from "@/bindings";
import barClasses from "../boards/MobileAnalysisBar.module.css";
import { MobilePuzzleSheet, type PuzzleStatLabels } from "./MobilePuzzleSheet";
import type { Puzzle } from "@/utils/puzzles";

interface MobilePuzzleBarProps {
  puzzleDbs: PuzzleDatabaseInfo[];
  availableThemes: string[];
  themesTableMissing: boolean;
  stats: PuzzleStatLabels;
  puzzles: Puzzle[];
  currentPuzzle: number;
  select: (i: number) => void;
  onAddDatabase: () => void;
  onDeleteDatabase: () => void;
  onClearSession: () => void;
  onNewPuzzle: () => void;
  /** Disabled while a puzzle generation is in flight (no database). */
  newPuzzleDisabled: boolean;
  onAnalyze: () => void;
  analyzeDisabled: boolean;
  onPrev: () => void;
  canPrev: boolean;
  onNext: () => void;
  canNext: boolean;
}

/**
 * The phone action bar for the Puzzles screen, laid out like the reference
 * training view: stats sheet opener, analyze, new puzzle, then the two
 * puzzle steppers with press-and-hold repeat. Hint and view-solution live in
 * the feedback strip under the board; the rest of the desktop panel is one
 * scrollable sheet behind the stats button.
 */
export function MobilePuzzleBar({
  puzzleDbs,
  availableThemes,
  themesTableMissing,
  stats,
  puzzles,
  currentPuzzle,
  select,
  onAddDatabase,
  onDeleteDatabase,
  onClearSession,
  onNewPuzzle,
  newPuzzleDisabled,
  onAnalyze,
  analyzeDisabled,
  onPrev,
  canPrev,
  onNext,
  canNext,
}: MobilePuzzleBarProps) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const onStepperPrev = usePressHold(onPrev);
  const onStepperNext = usePressHold(onNext);

  return (
    <>
      <Group wrap="nowrap" gap={0} h="100%" className={barClasses.bar}>
        <ActionIcon
          className={barClasses.button}
          variant="transparent"
          onClick={() => setSheetOpen(true)}
          aria-label={t("Puzzle.Mobile.Stats")}
        >
          <IconChartArea size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          className={barClasses.button}
          variant="transparent"
          onClick={onAnalyze}
          disabled={analyzeDisabled}
          aria-label={t("Puzzle.AnalyzePosition")}
        >
          <IconZoomCheck size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          className={barClasses.button}
          variant="transparent"
          onClick={onNewPuzzle}
          disabled={newPuzzleDisabled}
          aria-label={t("Puzzle.NewPuzzle")}
        >
          <IconPlus size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          {...onStepperPrev}
          className={barClasses.button}
          variant="transparent"
          disabled={!canPrev}
          aria-label={t("Board.Mobile.Previous")}
        >
          <IconChevronsLeft size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          {...onStepperNext}
          className={barClasses.button}
          variant="transparent"
          disabled={!canNext}
          aria-label={t("Board.Mobile.Next")}
        >
          <IconChevronsRight size="1.35rem" />
        </ActionIcon>
      </Group>

      <Drawer
        opened={sheetOpen}
        onClose={() => setSheetOpen(false)}
        position="bottom"
        size="80%"
        title={t("Puzzle.Filters")}
      >
        <MobilePuzzleSheet
          puzzleDbs={puzzleDbs}
          availableThemes={availableThemes}
          themesTableMissing={themesTableMissing}
          stats={stats}
          puzzles={puzzles}
          currentPuzzle={currentPuzzle}
          select={(i) => {
            setSheetOpen(false);
            select(i);
          }}
          onAddDatabase={onAddDatabase}
          onDeleteDatabase={onDeleteDatabase}
          onClearSession={onClearSession}
          onClose={() => setSheetOpen(false)}
        />
      </Drawer>
    </>
  );
}
