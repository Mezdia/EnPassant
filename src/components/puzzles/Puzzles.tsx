import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  Portal,
  RangeSlider,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import {
  IconAlertTriangle,
  IconFlame,
  IconPlus,
  IconSettings,
  IconTrash,
  IconX,
  IconZoomCheck,
} from "@tabler/icons-react";
import { isNormal, makeSquare, makeUci, parseUci } from "chessops";
import { parseFen } from "chessops/fen";
import { useAtom, useSetAtom } from "jotai";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { commands, type PuzzleDatabaseInfo } from "@/bindings";
import {
  activeTabAtom,
  currentPuzzleAtom,
  currentPuzzleTimerAtom,
  hidePuzzleRatingAtom,
  jumpToNextPuzzleAtom,
  progressivePuzzlesAtom,
  puzzleRatingRangeAtom,
  puzzleThemeAtom,
  selectedPuzzleDbAtom,
  tabsAtom,
  trackPuzzleTimeAtom,
} from "@/state/atoms";
import { positionFromFen } from "@/utils/chessops";
import { formatThemeLabel, formatTime } from "@/utils/format";
import { isDesktop } from "@/utils/platform";
import { type Completion, getPuzzleDatabases, type Puzzle } from "@/utils/puzzles";
import { createTab } from "@/utils/tabs";
import { defaultTree } from "@/utils/treeReducer";
import { unwrap } from "@/utils/unwrap";
import { useIsLandscape } from "@/utils/useIsLandscape";
import ChallengeHistory from "../common/ChallengeHistory";
import ConfirmModal from "../common/ConfirmModal";
import GameNotation from "../common/GameNotation";
import MoveControls from "../common/MoveControls";
import { TreeStateContext } from "../common/TreeStateContext";
import AddPuzzle from "./AddPuzzle";
import { MobilePuzzleControls } from "./MobilePuzzleControls";
import PuzzleBoard from "./PuzzleBoard";

function Puzzles({ id }: { id: string }) {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext)!;
  const setFen = useStore(store, (s) => s.setFen);
  const goToStart = useStore(store, (s) => s.goToStart);
  const reset = useStore(store, (s) => s.reset);
  const makeMove = useStore(store, (s) => s.makeMove);
  const setShapes = useStore(store, (s) => s.setShapes);
  const currentMove = useStore(store, (s) => s.currentNode().move);
  const [puzzles, setPuzzles] = useSessionStorage<Puzzle[]>({
    key: `${id}-puzzles`,
    defaultValue: [],
  });
  const [currentPuzzle, setCurrentPuzzle] = useAtom(currentPuzzleAtom);

  const [puzzleDbs, setPuzzleDbs] = useState<PuzzleDatabaseInfo[]>([]);
  const [selectedDb, setSelectedDb] = useAtom(selectedPuzzleDbAtom);

  const [settingsOpened, setSettingsOpened] = useState(false);
  /** Mobile only: the Filters sheet that replaces the desktop settings accordion. */
  const [filtersOpened, setFiltersOpened] = useState(false);
  const landscape = useIsLandscape();

  useEffect(() => {
    getPuzzleDatabases().then((databases) => {
      setPuzzleDbs(databases);
    });
  }, []);

  const [ratingRange, setRatingRange] = useAtom(puzzleRatingRangeAtom);

  const [selectedTheme, setSelectedTheme] = useAtom(puzzleThemeAtom);
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [themesTableMissing, setThemesTableMissing] = useState(false);
  const effectiveSelectedTheme =
    selectedTheme && availableThemes.includes(selectedTheme) ? selectedTheme : null;

  useEffect(() => {
    setThemesTableMissing(false);

    if (!selectedDb) {
      setAvailableThemes([]);
      return;
    }

    commands.getPuzzleThemes(selectedDb).then((res) => {
      if (res.status === "ok") {
        setAvailableThemes(res.data);
        return;
      }

      setAvailableThemes([]);

      if (typeof res.error === "string" && res.error.includes("no such table")) {
        setThemesTableMissing(true);
      }
    });
  }, [selectedDb]);

  const [jumpToNextPuzzleImmediately, setJumpToNextPuzzleImmediately] =
    useAtom(jumpToNextPuzzleAtom);

  const wonPuzzles = puzzles.filter((p) => p.completion === "correct");
  const lostPuzzles = puzzles.filter((p) => p.completion === "incorrect");

  const totalCompleted = wonPuzzles.length + lostPuzzles.length;
  const accuracy =
    totalCompleted > 0 ? Math.round((wonPuzzles.length / totalCompleted) * 100) : null;

  let currentStreak = 0;
  for (let i = puzzles.length - 1; i >= 0; i--) {
    if (puzzles[i].completion === "correct") currentStreak++;
    else if (puzzles[i].completion === "incorrect") break;
  }

  const avgTimeSeconds =
    wonPuzzles.length > 0
      ? wonPuzzles.reduce((acc, p) => acc + (p.timeSpent || 0), 0) / wonPuzzles.length / 1000
      : 0;

  function setPuzzle(puzzle: { fen: string; moves: string[] }) {
    setFen(puzzle.fen);
    makeMove({ payload: parseUci(puzzle.moves[0])! });
  }

  const solutionAbortRef = useRef<AbortController | null>(null);

  async function generatePuzzle(db: string, force: boolean = false) {
    let nextIndex = puzzles.findIndex((p, i) => i > currentPuzzle && p.completion === "incomplete");
    if (nextIndex === -1) {
      nextIndex = puzzles.findIndex((p, i) => i < currentPuzzle && p.completion === "incomplete");
    }

    if (nextIndex !== -1 && !force) {
      solutionAbortRef.current?.abort();
      setIsPlayingSolution(false);
      setCurrentPuzzle(nextIndex);
      setPuzzle(puzzles[nextIndex]);
      if (trackTime) {
        setTimerStart(Date.now() - (puzzles[nextIndex].timeSpent || 0));
      }
      return;
    }

    solutionAbortRef.current?.abort();
    setIsPlayingSolution(false);

    let range = ratingRange;
    if (progressive) {
      const rating = puzzles[currentPuzzle]?.rating;
      if (rating) {
        range = [rating + 50, rating + 100];
        setRatingRange([rating + 50, rating + 100]);
      }
    }
    const res = await commands.getPuzzle(db, range[0], range[1], effectiveSelectedTheme);
    const puzzle = unwrap(res);
    const newPuzzle: Puzzle = {
      ...puzzle,
      moves: puzzle.moves.split(" "),
      completion: "incomplete",
    };
    setPuzzles((puzzles) => {
      return [...puzzles, newPuzzle];
    });
    setCurrentPuzzle(puzzles.length);
    setPuzzle(newPuzzle);
    if (trackTime) {
      setTimerStart(Date.now());
    }
  }

  async function changeCompletion(completion: Completion) {
    const timeSpent = timerStart !== null ? Date.now() - timerStart : 0;
    const puzzle = puzzles[currentPuzzle];
    setPuzzles((puzzles) => {
      puzzles[currentPuzzle].completion = completion;
      puzzles[currentPuzzle].timeSpent = timeSpent;
      return [...puzzles];
    });
    setTimerStart(null);

    if (selectedDb && puzzle?.id) {
      const res = await commands.getThemesForPuzzle(selectedDb, puzzle.id);
      if (res.status === "ok") {
        setPuzzles((puzzles) => {
          puzzles[currentPuzzle].themes = res.data;
          return [...puzzles];
        });
      }
    }
  }

  const [addOpened, setAddOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [isPlayingSolution, setIsPlayingSolution] = useState(false);

  const [progressive, setProgressive] = useAtom(progressivePuzzlesAtom);
  const [hideRating, setHideRating] = useAtom(hidePuzzleRatingAtom);
  const [trackTime, setTrackTime] = useAtom(trackPuzzleTimeAtom);

  const [timerStart, setTimerStart] = useAtom(currentPuzzleTimerAtom);
  const [, setTick] = useState(0);
  const isPuzzleIncomplete = puzzles[currentPuzzle]?.completion === "incomplete";
  const elapsedTime =
    timerStart && isPuzzleIncomplete && trackTime
      ? Date.now() - timerStart
      : puzzles[currentPuzzle]?.timeSpent || 0;

  useEffect(() => {
    if (trackTime && isPuzzleIncomplete && timerStart === null) {
      setTimerStart(Date.now());
    }
  }, [trackTime, isPuzzleIncomplete, timerStart, setTimerStart]);

  useEffect(() => {
    if (!trackTime || !isPuzzleIncomplete || timerStart === null) return;

    const displayInterval = setInterval(() => {
      setTick((t) => t + 1);
    }, 100);

    return () => clearInterval(displayInterval);
  }, [trackTime, isPuzzleIncomplete, timerStart]);

  useEffect(() => {
    return () => {
      if (trackTime && timerStart !== null && isPuzzleIncomplete) {
        const finalElapsed = Date.now() - timerStart;
        setPuzzles((prev) => {
          const newPuzzles = [...prev];
          if (newPuzzles[currentPuzzle]) {
            newPuzzles[currentPuzzle].timeSpent = finalElapsed;
          }
          return newPuzzles;
        });
      }
    };
  }, [trackTime, timerStart, currentPuzzle, isPuzzleIncomplete, setPuzzles]);

  const [, setTabs] = useAtom(tabsAtom);
  const setActiveTab = useSetAtom(activeTabAtom);

  const turnToMove =
    puzzles[currentPuzzle] !== undefined
      ? positionFromFen(puzzles[currentPuzzle]?.fen)[0]?.turn
      : null;

  const currentlyOnLastMoveOrNoLastMove = (): boolean => {
    if (!currentMove) return true;

    const moves = puzzles[currentPuzzle]?.moves;
    if (!moves) return true;

    const lastMoveIndex = moves.indexOf(makeUci(currentMove));
    return lastMoveIndex + 1 === moves.length;
  };

  const nextMoveUci = () => {
    const curPuzzle = puzzles[currentPuzzle];
    if (!curPuzzle || !currentMove) return;

    const indexOfNextMoveToPlay = curPuzzle.moves.indexOf(makeUci(currentMove)) + 1;
    const nextMoveUci = curPuzzle.moves[indexOfNextMoveToPlay];
    if (!nextMoveUci) return;

    const nextMove = parseUci(nextMoveUci);
    if (!nextMove || !isNormal(nextMove)) return;

    return nextMove;
  };

  /** Progressive hint on the next move: circle → arrow → cleared. */
  function showHint() {
    solutionAbortRef.current?.abort();
    setIsPlayingSolution(false);
    const curPuzzle = puzzles[currentPuzzle];

    if (curPuzzle.completion === "incomplete") {
      changeCompletion("incorrect");
    }

    if (currentlyOnLastMoveOrNoLastMove()) return;

    const nextMove = nextMoveUci();
    if (!nextMove) return;

    const from = makeSquare(nextMove.from);
    const to = makeSquare(nextMove.to);
    const currentShapes = store.getState().currentNode().shapes;

    const hasCircle = currentShapes.some((s) => s.orig === from && !s.dest);
    const hasArrow = currentShapes.some((s) => s.orig === from && s.dest === to);

    if (hasArrow) {
      setShapes(currentShapes.filter((s) => !(s.orig === from && (!s.dest || s.dest === to))));
    } else if (hasCircle) {
      setShapes([
        ...currentShapes.filter((s) => !(s.orig === from && !s.dest)),
        { orig: from, dest: to, brush: "green" },
      ]);
    } else {
      setShapes([...currentShapes, { orig: from, dest: undefined, brush: "green" }]);
    }
  }

  /** Replays the whole solution from the start, one move every 500ms. */
  async function playSolution() {
    solutionAbortRef.current?.abort();
    const abortController = new AbortController();
    solutionAbortRef.current = abortController;

    const curPuzzle = puzzles[currentPuzzle];
    if (curPuzzle.completion === "incomplete") {
      changeCompletion("incorrect");
    }
    setIsPlayingSolution(true);
    goToStart();
    for (let i = 0; i < curPuzzle.moves.length; i++) {
      if (abortController.signal.aborted) break;
      makeMove({
        payload: parseUci(curPuzzle.moves[i])!,
        mainline: true,
      });
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsPlayingSolution(false);
  }

  function analyzePosition() {
    const curPuzzle = puzzles[currentPuzzle];
    if (!curPuzzle) return;

    createTab({
      tab: {
        name: "Puzzle Analysis",
        type: "analysis",
      },
      setTabs,
      setActiveTab,
      pgn: curPuzzle.moves.join(" "),
      headers: {
        ...defaultTree().headers,
        fen: curPuzzle.fen,
        orientation: parseFen(curPuzzle.fen).unwrap().turn === "white" ? "black" : "white",
      },
    });
  }

  function clearSession() {
    setPuzzles([]);
    reset();
    setTimerStart(null);
    setIsPlayingSolution(false);
  }

  const hintDisabled =
    puzzles.length === 0 || currentlyOnLastMoveOrNoLastMove() || isPlayingSolution;
  const solutionDisabled = puzzles.length === 0;
  const displayedRating =
    isPuzzleIncomplete && hideRating && puzzles[currentPuzzle]?.rating
      ? "?"
      : String(puzzles[currentPuzzle]?.rating ?? "-");

  const mobile = !isDesktop();

  const addPuzzleModal = (
    <AddPuzzle
      puzzleDbs={puzzleDbs}
      opened={addOpened}
      setOpened={setAddOpened}
      setPuzzleDbs={setPuzzleDbs}
    />
  );

  const deleteDbModal = (
    <ConfirmModal
      title="Delete Puzzle Database"
      description="Are you sure you want to delete this puzzle database?"
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      onConfirm={async () => {
        if (selectedDb) {
          await commands.deletePuzzleDatabase(selectedDb);
          setPuzzleDbs((dbs) => dbs.filter((db) => db.path !== selectedDb));
          setSelectedDb(null);
          clearSession();
        }
        setDeleteModalOpened(false);
      }}
    />
  );

  const puzzleHistory = (
    <ChallengeHistory
      challenges={puzzles.map((p) => ({
        ...p,
        label: p.rating?.toString() ?? "-",
      }))}
      current={currentPuzzle}
      select={(i) => {
        if (i === currentPuzzle) return;
        solutionAbortRef.current?.abort();
        setIsPlayingSolution(false);
        setCurrentPuzzle(i);
        setPuzzle(puzzles[i]);
        if (puzzles[i].completion === "incomplete") {
          setTimerStart(Date.now() - (puzzles[i].timeSpent || 0));
        } else {
          setTimerStart(null);
        }
      }}
    />
  );

  if (mobile) {
    const controls = (
      <>
        {addPuzzleModal}
        {deleteDbModal}
        <MobilePuzzleControls
          puzzleDbs={puzzleDbs}
          availableThemes={availableThemes}
          themesTableMissing={themesTableMissing}
          stats={{
            rating: displayedRating,
            accuracy,
            streak: currentStreak,
            time: trackTime ? formatTime(elapsedTime) : null,
            avgTime: trackTime && avgTimeSeconds > 0 ? `${avgTimeSeconds.toFixed(1)}s` : null,
          }}
          themes={!isPuzzleIncomplete ? (puzzles[currentPuzzle]?.themes ?? []) : []}
          turnToMove={turnToMove ?? null}
          onAddDatabase={() => setAddOpened(true)}
          onDeleteDatabase={() => setDeleteModalOpened(true)}
          onNewPuzzle={() => selectedDb && generatePuzzle(selectedDb, true)}
          onAnalyze={analyzePosition}
          onClearSession={clearSession}
          onHint={showHint}
          onViewSolution={playSolution}
          hintDisabled={hintDisabled}
          solutionDisabled={solutionDisabled}
          filtersOpened={filtersOpened}
          setFiltersOpened={setFiltersOpened}
        />
      </>
    );

    /** Capped so a long session's icon grid can never crowd out the board. */
    const history = (
      <Paper withBorder p="xs">
        <ScrollArea.Autosize mah={110} offsetScrollbars>
          {puzzleHistory}
        </ScrollArea.Autosize>
      </Paper>
    );

    return (
      <>
        <Portal target="#left" style={{ height: "100%" }}>
          <PuzzleBoard
            key={currentPuzzle}
            puzzles={puzzles}
            currentPuzzle={currentPuzzle}
            changeCompletion={changeCompletion}
            generatePuzzle={generatePuzzle}
            db={selectedDb}
          />
        </Portal>
        {/* Landscape mirrors the desktop columns: board + history left, controls
            and notation in the right column. Portrait keeps the action rows
            directly under the board and pushes the rest into the sheet. */}
        <Portal target="#bottomRight">{landscape ? history : controls}</Portal>
        <Portal target="#topRight" style={{ height: "100%" }}>
          <Stack h="100%" gap="xs">
            {landscape ? controls : history}
            <Stack flex={1} gap="xs" style={{ minHeight: 0 }}>
              <GameNotation />
              <MoveControls readOnly />
            </Stack>
          </Stack>
        </Portal>
      </>
    );
  }

  return (
    <>
      <Portal target="#left" style={{ height: "100%" }}>
        <PuzzleBoard
          key={currentPuzzle}
          puzzles={puzzles}
          currentPuzzle={currentPuzzle}
          changeCompletion={changeCompletion}
          generatePuzzle={generatePuzzle}
          db={selectedDb}
        />
      </Portal>
      <Portal target="#topRight" style={{ height: "100%" }}>
        <Paper
          h="100%"
          withBorder
          p="md"
          style={{
            overflow: "hidden",
          }}
        >
          {addPuzzleModal}
          {deleteDbModal}
          <Group justify="space-between" pb="sm">
            <Select
              style={{ flex: 1 }}
              data={puzzleDbs
                .map((p) => ({
                  label: p.title.split(".db3")[0],
                  value: p.path,
                }))
                .concat({ label: `+ ${t("Common.AddNew")}`, value: "add" })}
              value={selectedDb}
              clearable={false}
              placeholder={t("Puzzle.SelectDatabase")}
              onChange={(v) => {
                if (v === "add") {
                  setAddOpened(true);
                } else {
                  setSelectedDb(v);
                }
              }}
            />
            <Group gap="xs">
              <Tooltip label={t("Puzzle.DeleteDatabase")}>
                <ActionIcon
                  color="red"
                  disabled={!selectedDb}
                  onClick={() => setDeleteModalOpened(true)}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t("SideBar.Settings")}>
                <ActionIcon onClick={() => setSettingsOpened((o) => !o)}>
                  <IconSettings size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <Accordion
            value={settingsOpened ? "settings" : null}
            onChange={(v) => setSettingsOpened(v === "settings")}
            mb="sm"
          >
            <Accordion.Item value="settings">
              <Accordion.Panel>
                <Stack gap="md">
                  {themesTableMissing && (
                    <Alert
                      icon={<IconAlertTriangle />}
                      title={t("Puzzle.DatabaseOutdated")}
                      color="yellow"
                    >
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
                      checked={jumpToNextPuzzleImmediately}
                      onChange={(event) =>
                        setJumpToNextPuzzleImmediately(event.currentTarget.checked)
                      }
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
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Group grow>
            <Paper withBorder p="xs">
              <Text size="xs" c="dimmed">
                {t("Puzzle.Rating")}
              </Text>
              <Text fw={700} size="lg">
                {isPuzzleIncomplete && hideRating && puzzles[currentPuzzle]?.rating
                  ? "?"
                  : puzzles[currentPuzzle]?.rating || "-"}
              </Text>
            </Paper>

            {trackTime && (
              <Paper withBorder p="xs">
                <Text size="xs" c="dimmed">
                  {t("Puzzle.Time")}
                </Text>
                <Text fw={700} size="lg" ff="monospace">
                  {formatTime(elapsedTime)}
                </Text>
              </Paper>
            )}

            <Paper withBorder p="xs">
              <Text size="xs" c="dimmed">
                {t("Puzzle.Accuracy")}
              </Text>
              <Text
                fw={700}
                size="lg"
                c={accuracy === null ? "dimmed" : accuracy >= 50 ? "teal" : "orange"}
              >
                {accuracy !== null ? `${accuracy}%` : "-"}
              </Text>
            </Paper>

            <Paper withBorder p="xs">
              <Text size="xs" c="dimmed">
                {t("Puzzle.Streak")}
              </Text>
              <Group gap={2}>
                <Text fw={700} size="lg">
                  {currentStreak}
                </Text>
                <IconFlame size={20} color="orange" />
              </Group>
            </Paper>

            {trackTime && avgTimeSeconds > 0 && (
              <Paper withBorder p="xs">
                <Text size="xs" c="dimmed">
                  {t("Puzzle.AvgTime")}
                </Text>
                <Text fw={700} size="lg">
                  {avgTimeSeconds.toFixed(1)}s
                </Text>
              </Paper>
            )}
          </Group>
          <Divider my="sm" />
          {!isPuzzleIncomplete && (puzzles[currentPuzzle]?.themes?.length ?? 0) > 0 && (
            <Group gap="xs" mb="sm">
              {puzzles[currentPuzzle]?.themes?.map((theme) => (
                <Badge key={theme} variant="light" size="sm">
                  {formatThemeLabel(theme)}
                </Badge>
              ))}
            </Group>
          )}
          <Group justify="space-between">
            <Text fz="1.75rem" fw={500}>
              {!turnToMove
                ? ""
                : turnToMove === "white"
                  ? t("Fen.BlackToMove")
                  : t("Fen.WhiteToMove")}
            </Text>
            <Group gap="xs">
              <Tooltip label={t("Puzzle.NewPuzzle")}>
                <ActionIcon
                  disabled={!selectedDb}
                  onClick={() => generatePuzzle(selectedDb!, true)}
                >
                  <IconPlus />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t("Puzzle.AnalyzePosition")}>
                <ActionIcon disabled={!selectedDb} onClick={analyzePosition}>
                  <IconZoomCheck />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t("Puzzle.ClearSession")}>
                <ActionIcon onClick={clearSession}>
                  <IconX />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <Group grow>
            <Button mt="sm" variant="light" fullWidth onClick={showHint} disabled={hintDisabled}>
              {t("Puzzle.GetAHint")}
            </Button>
            <Button
              mt="sm"
              variant="light"
              fullWidth
              onClick={playSolution}
              disabled={solutionDisabled}
            >
              {t("Puzzle.ViewSolution")}
            </Button>
          </Group>
        </Paper>
      </Portal>
      <Portal target="#bottomRight" style={{ height: "100%" }}>
        <Stack h="100%" gap="xs">
          <Paper withBorder p="md" mih="5rem">
            <ScrollArea h="100%" offsetScrollbars>
              {puzzleHistory}
            </ScrollArea>
          </Paper>
          <Stack flex={1} gap="xs">
            <GameNotation />
            <MoveControls readOnly />
          </Stack>
        </Stack>
      </Portal>
    </>
  );
}

export default Puzzles;
