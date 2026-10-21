import {
  Alert,
  Button,
  Divider,
  Group,
  RangeSlider,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { IconAlertTriangle, IconFlame, IconTrash, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import type { PuzzleDatabaseInfo } from "@/bindings";
import {
  currentPuzzleTimerAtom,
  hidePuzzleRatingAtom,
  jumpToNextPuzzleAtom,
  progressivePuzzlesAtom,
  puzzleRatingRangeAtom,
  puzzleThemeAtom,
  selectedPuzzleDbAtom,
  trackPuzzleTimeAtom,
} from "@/state/atoms";
import { formatThemeLabel } from "@/utils/format";
import type { Puzzle } from "@/utils/puzzles";
import { MobilePuzzleHistoryCard } from "./MobilePuzzleHistoryCard";

/**
 * Pre-formatted stat strings — the masking/rounding rules live in `Puzzles`.
 */
export type PuzzleStatLabels = {
  /** Already masked to "?" when the rating is hidden until solved. */
  rating: string;
  accuracy: number | null;
  streak: number;
  /** Null when time tracking is off. */
  time: string | null;
  /** Null when there is no solved puzzle to average yet. */
  avgTime: string | null;
};

type MobilePuzzleSheetProps = {
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
  onClose: () => void;
};

/**
 * Content of the phone stats sheet (opened by the bar's stats button). It
 * groups everything the desktop panel stacks beside the board — session
 * stats, history, the database picker, filters and the destructive session
 * actions — so the board-facing UI is only the feedback strip and the bar.
 */
export function MobilePuzzleSheet({
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
  onClose,
}: MobilePuzzleSheetProps) {
  const { t } = useTranslation();
  const [selectedDb, setSelectedDb] = useAtom(selectedPuzzleDbAtom);

  return (
    <ScrollArea.Autosize mah="70vh" offsetScrollbars>
      <Stack gap="md" pb="md">
        <div>
          <Text fz="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
            {t("Puzzle.Mobile.Stats")}
          </Text>
          <PuzzleStats stats={stats} />
        </div>

        <MobilePuzzleHistoryCard puzzles={puzzles} current={currentPuzzle} select={select} />

        <Divider />

        <Select
          label={t("Puzzle.Database")}
          data={puzzleDbs
            .map((p) => ({ label: p.title.split(".db3")[0], value: p.path }))
            .concat({ label: `+ ${t("Common.AddNew")}`, value: "add" })}
          value={selectedDb}
          clearable={false}
          placeholder={t("Puzzle.SelectDatabase")}
          onChange={(v) => {
            if (v === "add") {
              onClose();
              onAddDatabase();
            } else {
              setSelectedDb(v);
            }
          }}
        />

        <PuzzleFilters availableThemes={availableThemes} themesTableMissing={themesTableMissing} />

        <Divider />

        <Group grow gap="xs">
          <Button variant="default" leftSection={<IconX size={16} />} onClick={onClearSession}>
            {t("Puzzle.ClearSession")}
          </Button>
          <Button
            variant="default"
            color="red"
            leftSection={<IconTrash size={16} />}
            disabled={!selectedDb}
            onClick={onDeleteDatabase}
          >
            {t("Puzzle.DeleteDatabase")}
          </Button>
        </Group>
      </Stack>
    </ScrollArea.Autosize>
  );
}

/** Rating · accuracy · streak (+ time when tracked) as a single compact row. */
export function PuzzleStats({ stats }: { stats: PuzzleStatLabels }) {
  const { t } = useTranslation();

  return (
    <Group gap="sm" wrap="nowrap">
      <Stat label={t("Puzzle.Rating")} value={stats.rating} />
      {stats.time !== null && <Stat label={t("Puzzle.Time")} value={stats.time} monospace />}
      <Stat
        label={t("Puzzle.Accuracy")}
        value={stats.accuracy !== null ? `${stats.accuracy}%` : "-"}
        color={stats.accuracy === null ? undefined : stats.accuracy >= 50 ? "teal" : "orange"}
      />
      <Group gap={2} wrap="nowrap">
        <Stat label={t("Puzzle.Streak")} value={String(stats.streak)} />
        <IconFlame size={16} color="orange" />
      </Group>
      {stats.avgTime !== null && <Stat label={t("Puzzle.AvgTime")} value={stats.avgTime} />}
    </Group>
  );
}

function Stat({
  label,
  value,
  color,
  monospace,
}: {
  label: string;
  value: string;
  color?: string;
  monospace?: boolean;
}) {
  return (
    <div>
      <Text fz={10} c="dimmed" lh={1.2}>
        {label}
      </Text>
      <Text fz="sm" fw={700} lh={1.2} c={color} ff={monospace ? "monospace" : undefined}>
        {value}
      </Text>
    </div>
  );
}

/**
 * Rating range, theme and the four session switches.
 *
 * Shared with the landscape column in future, writing straight to the same
 * atoms the desktop panel uses. Ported from the old filters sheet.
 */
function PuzzleFilters({
  availableThemes,
  themesTableMissing,
}: {
  availableThemes: string[];
  themesTableMissing: boolean;
}) {
  const { t } = useTranslation();
  const [ratingRange, setRatingRange] = useAtom(puzzleRatingRangeAtom);
  const [selectedTheme, setSelectedTheme] = useAtom(puzzleThemeAtom);
  const [progressive, setProgressive] = useAtom(progressivePuzzlesAtom);
  const [hideRating, setHideRating] = useAtom(hidePuzzleRatingAtom);
  const [jumpToNext, setJumpToNext] = useAtom(jumpToNextPuzzleAtom);
  const [trackTime, setTrackTime] = useAtom(trackPuzzleTimeAtom);
  const setTimerStart = useAtom(currentPuzzleTimerAtom)[1];

  const effectiveSelectedTheme =
    selectedTheme && availableThemes.includes(selectedTheme) ? selectedTheme : null;

  return (
    <Stack gap="md">
      {themesTableMissing && (
        <Alert icon={<IconAlertTriangle />} title={t("Puzzle.DatabaseOutdated")} color="yellow">
          {t("Puzzle.DatabaseOutdated.Desc")}
        </Alert>
      )}
      <div>
        <Text size="sm" fw={500} mb={4}>
          {t("Puzzle.RatingRange")}
        </Text>
        <RangeSlider
          min={600}
          my="md"
          max={2800}
          value={ratingRange}
          onChange={setRatingRange}
          disabled={progressive}
          marks={[
            { value: 600, label: "600" },
            { value: 1700, label: "1700" },
            { value: 2800, label: "2800" },
          ]}
        />
      </div>
      <Select
        label={t("Puzzle.Theme")}
        placeholder={t("Puzzle.AllThemes")}
        data={availableThemes.map((theme) => ({
          label: formatThemeLabel(theme),
          value: theme,
        }))}
        value={effectiveSelectedTheme}
        onChange={setSelectedTheme}
        clearable
        searchable
      />
      <SimpleGrid cols={2} spacing="sm">
        <Switch
          label={t("Puzzle.Progressive")}
          description={t("Puzzle.Progressive.Desc")}
          checked={progressive}
          onChange={(event) => setProgressive(event.currentTarget.checked)}
        />
        <Switch
          label={t("Puzzle.HideRating")}
          description={t("Puzzle.HideRating.Desc")}
          checked={hideRating}
          onChange={(event) => setHideRating(event.currentTarget.checked)}
        />
        <Switch
          label={t("Puzzle.JumpToNextPuzzleImmediately")}
          description={t("Puzzle.JumpToNextPuzzleImmediately.Desc")}
          checked={jumpToNext}
          onChange={(event) => setJumpToNext(event.currentTarget.checked)}
        />
        <Switch
          label={t("Puzzle.TrackPuzzleTime")}
          description={t("Puzzle.TrackPuzzleTime.Desc")}
          checked={trackTime}
          onChange={(event) => {
            if (!event.currentTarget.checked) {
              setTimerStart(null);
              setTrackTime(false);
            } else {
              setTrackTime(true);
            }
          }}
        />
      </SimpleGrid>
    </Stack>
  );
}
