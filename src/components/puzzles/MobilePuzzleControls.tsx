import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Drawer,
  Group,
  Menu,
  RangeSlider,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconDotsVertical,
  IconFilter,
  IconFlame,
  IconTrash,
  IconX,
  IconZoomCheck,
} from "@tabler/icons-react";
import { useAtom, useSetAtom } from "jotai";
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

/**
 * Mobile controls for the Puzzles screen.
 *
 * The desktop panel stacks the database picker, a settings accordion, up to five
 * stat cards, the theme badges and the action buttons into one tall column. On a
 * phone the board is the point, so this splits it in two: a three-line action
 * bar that stays next to the board, and everything configurable behind a
 * Filters sheet.
 */

/** Pre-formatted stat strings — the masking/rounding rules live in `Puzzles`. */
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

export function MobilePuzzleControls({
  puzzleDbs,
  availableThemes,
  themesTableMissing,
  stats,
  themes,
  turnToMove,
  onAddDatabase,
  onDeleteDatabase,
  onNewPuzzle,
  onAnalyze,
  onClearSession,
  onHint,
  onViewSolution,
  hintDisabled,
  solutionDisabled,
  filtersOpened,
  setFiltersOpened,
}: {
  puzzleDbs: PuzzleDatabaseInfo[];
  availableThemes: string[];
  themesTableMissing: boolean;
  stats: PuzzleStatLabels;
  themes: string[];
  turnToMove: "white" | "black" | null;
  onAddDatabase: () => void;
  onDeleteDatabase: () => void;
  onNewPuzzle: () => void;
  onAnalyze: () => void;
  onClearSession: () => void;
  onHint: () => void;
  onViewSolution: () => void;
  hintDisabled: boolean;
  solutionDisabled: boolean;
  filtersOpened: boolean;
  setFiltersOpened: (opened: boolean) => void;
}) {
  const { t } = useTranslation();
  const [selectedDb, setSelectedDb] = useAtom(selectedPuzzleDbAtom);

  return (
    <Stack gap="xs" p="xs">
      <Group gap="xs" wrap="nowrap">
        <Text fz="md" fw={500} style={{ flex: 1, minWidth: 0 }} truncate>
          {!turnToMove ? "" : turnToMove === "white" ? t("Fen.BlackToMove") : t("Fen.WhiteToMove")}
        </Text>
        <PuzzleStats stats={stats} />
      </Group>

      {themes.length > 0 && (
        <Group gap={4}>
          {themes.map((theme) => (
            <Badge key={theme} variant="light" size="sm">
              {formatThemeLabel(theme)}
            </Badge>
          ))}
        </Group>
      )}

      <Group gap="xs" wrap="nowrap">
        <Button
          variant="light"
          style={{ flex: 1 }}
          onClick={onHint}
          disabled={hintDisabled}
          size="compact-md"
        >
          {t("Puzzle.GetAHint")}
        </Button>
        <Button
          variant="light"
          style={{ flex: 1 }}
          onClick={onViewSolution}
          disabled={solutionDisabled}
          size="compact-md"
        >
          {t("Puzzle.ViewSolution")}
        </Button>
        <Button style={{ flex: 1 }} onClick={onNewPuzzle} disabled={!selectedDb} size="compact-md">
          {t("Puzzle.NewPuzzle")}
        </Button>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <Button
          variant="default"
          leftSection={<IconFilter size={16} />}
          style={{ flex: 1 }}
          onClick={() => setFiltersOpened(true)}
          size="compact-md"
        >
          {t("Puzzle.Filters")}
        </Button>
        <Menu position="top-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="default" size="lg" aria-label={t("Common.More")}>
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconZoomCheck size={16} />}
              onClick={onAnalyze}
              disabled={!selectedDb}
            >
              {t("Puzzle.AnalyzePosition")}
            </Menu.Item>
            <Menu.Item leftSection={<IconX size={16} />} onClick={onClearSession}>
              {t("Puzzle.ClearSession")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={onDeleteDatabase}
              disabled={!selectedDb}
            >
              {t("Puzzle.DeleteDatabase")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Drawer
        opened={filtersOpened}
        onClose={() => setFiltersOpened(false)}
        position="bottom"
        size="80%"
        title={t("Puzzle.Filters")}
      >
        <ScrollArea.Autosize mah="70vh" offsetScrollbars>
          <Stack gap="md" pb="md">
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
                  setFiltersOpened(false);
                  onAddDatabase();
                } else {
                  setSelectedDb(v);
                }
              }}
            />
            <PuzzleFilters
              availableThemes={availableThemes}
              themesTableMissing={themesTableMissing}
            />
          </Stack>
        </ScrollArea.Autosize>
      </Drawer>
    </Stack>
  );
}

/** Rating · accuracy · streak (+ time when tracked) as a single compact row. */
function PuzzleStats({ stats }: { stats: PuzzleStatLabels }) {
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
 * Shared by the portrait Filters sheet and the landscape column, so both stay in
 * step — they write straight to the same atoms the desktop panel uses.
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
  const setTimerStart = useSetAtom(currentPuzzleTimerAtom);

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
