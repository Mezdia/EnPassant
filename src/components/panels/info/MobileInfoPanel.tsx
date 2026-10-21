import {
  ActionIcon,
  Box,
  Card,
  Collapse,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconPlus } from "@tabler/icons-react";
import { useToggle } from "@mantine/hooks";
import { useAtom, useAtomValue } from "jotai";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { commands } from "@/bindings";
import { TreeStateContext } from "@/components/common/TreeStateContext";
import ConfirmChangesModal from "@/components/tabs/ConfirmChangesModal";
import { currentTabAtom } from "@/state/atoms";
import { parsePGN } from "@/utils/chess";
import { formatNumber } from "@/utils/format";
import { getStats } from "@/utils/repertoire";
import { getTabFile, getTabGameNumber } from "@/utils/tabs";
import { unwrap } from "@/utils/unwrap";
import useSWR from "swr";
import { useNavigate } from "@tanstack/react-router";
import { getDatabases } from "@/utils/db";
import { useActiveDatabaseViewStore } from "@/state/store/database";
import FenSearch from "./FenSearch";
import FileInfo from "./FileInfo";
import GameSelector from "./GameSelector";
import MobileGameInfo from "./MobileGameInfo";
import classes from "./MobileInfoPanel.module.css";
import MobilePgnSection from "./MobilePgnSection";

/**
 * Phone version of InfoPanel.tsx (portrait only — BoardAnalysis switches on
 * `useIsMobilePortrait`). The desktop panel bolts a games-list accordion onto
 * a dense header grid and a screen-filling PGN textarea; here the same pieces
 * stack in one scroller. Upstream subcomponents (`FileInfo`, `GameSelector`,
 * `FenSearch` and GameInfo's header data) are reused as-is — the fork owns
 * only the collapsed switcher row, the stacked header editor and the collapsible
 * PGN section.
 */
export default function MobileInfoPanel({ addGame }: { addGame?: () => void }) {
  const store = use(TreeStateContext)!;
  const stats = useStore(store, getStats);
  const headers = useStore(store, (s) => s.headers);
  const [games, setGames] = useState<Map<number, string>>(new Map());
  const currentTab = useAtomValue(currentTabAtom);
  const tabFile = getTabFile(currentTab);
  const gameNumber = getTabGameNumber(currentTab);
  const { t } = useTranslation();

  return (
    <Stack h="100%" gap={0}>
      {currentTab?.gameOrigin.kind === "database" && (
        <DatabaseCard path={currentTab.gameOrigin.database} id={currentTab.gameOrigin.gameId} />
      )}
      {tabFile && <GameSwitcher games={games} setGames={setGames} addGame={addGame} />}
      <ScrollArea flex={1} style={{ minHeight: 0 }}>
        <Stack px="sm" py="sm" gap="sm">
          <FileInfo setGames={setGames} />
          <MobileGameInfo
            headers={headers}
            changeTitle={(title: string) => {
              setGames((prev) => {
                const newGames = new Map(prev);
                newGames.set(gameNumber, title);
                return newGames;
              });
            }}
          />
          <FenSearch />
          <MobilePgnSection />
          <Group justify="center" gap="md">
            <Text fz="xs" c="dimmed">
              {t("PgnInput.Variations")}: {stats.leafs}
            </Text>
            <Text fz="xs" c="dimmed">
              {t("PgnInput.MaxDepth")}: {stats.depth}
            </Text>
            <Text fz="xs" c="dimmed">
              {t("PgnInput.TotalMoves")}: {stats.total}
            </Text>
          </Group>
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

/** Mirrors InfoPanel's DatabaseInfo card, reshaped as a bordered phone card. */
function DatabaseCard({ path, id: _id }: { path: string; id: number }) {
  const { data: databases, isLoading } = useSWR("databases", () => getDatabases());
  const dbInfo = databases?.find((db) => db.file === path);
  const navigate = useNavigate();
  const setActiveDatabase = useActiveDatabaseViewStore((store) => store.setDatabase);
  const { t } = useTranslation();

  if (isLoading || !dbInfo || dbInfo.type !== "success") {
    return null;
  }
  return (
    <Card withBorder radius={0} py="sm" px="sm">
      <Stack
        gap={2}
        style={{ cursor: "pointer" }}
        onClick={async () => {
          await navigate({
            to: "/databases/$databaseId",
            params: { databaseId: dbInfo.title },
          });
          setActiveDatabase(dbInfo);
        }}
      >
        <Text tt="uppercase" c="dimmed" fw={700} size="xs">
          {t("Board.Tabs.Database")}
        </Text>
        <Text fw="bold">{dbInfo.title}</Text>
        <Text size="xs" c="dimmed">
          {dbInfo.description}
        </Text>
      </Stack>
    </Card>
  );
}

/**
 * Phone re-layout of InfoPanel's `GameSelectorAccordion`: inline step arrows
 * make flipping games a one-tap action, and tapping the game title opens the
 * (screen-width) list instead of a 10rem box that still scrolls. Hotkeys are
 * omitted — they are a desktop affordance.
 */
function GameSwitcher({
  games,
  setGames,
  addGame,
}: {
  games: Map<number, string>;
  setGames: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  addGame?: () => void;
}) {
  const store = use(TreeStateContext)!;
  const dirty = useStore(store, (s) => s.dirty);
  const setState = useStore(store, (s) => s.setState);
  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);

  const [confirmChanges, toggleConfirmChanges] = useToggle();
  const [listOpen, setListOpen] = useState(false);
  const [tempPage, setTempPage] = useState(0);

  const tabFile = getTabFile(currentTab);
  const gameNumber = getTabGameNumber(currentTab);
  const currentName = games.get(gameNumber) || "Untitled";
  const { t } = useTranslation();

  async function setPage(page: number, forced?: boolean) {
    if (!tabFile) return;
    if (!forced && dirty) {
      setTempPage(page);
      toggleConfirmChanges();
      return;
    }

    const filePath = tabFile.path;
    const data = unwrap(await commands.readGames(filePath, page, page));
    const tree = await parsePGN(data[0]);
    setState(tree);

    setCurrentTab((prev) => {
      if (prev.gameOrigin.kind !== "file" && prev.gameOrigin.kind !== "temp_file") {
        return prev;
      }
      return {
        ...prev,
        gameOrigin: {
          ...prev.gameOrigin,
          gameNumber: page,
        },
      };
    });
  }

  async function deleteGame(index: number) {
    if (!tabFile) return;
    await commands.deleteGame(tabFile.path, index);
    setCurrentTab((prev) => {
      if (prev.gameOrigin.kind !== "file" && prev.gameOrigin.kind !== "temp_file") {
        return prev;
      }
      return {
        ...prev,
        gameOrigin: {
          ...prev.gameOrigin,
          file: {
            ...prev.gameOrigin.file,
            numGames: prev.gameOrigin.file.numGames - 1,
          },
        },
      };
    });
    setGames(new Map());
  }

  if (!tabFile) return null;

  return (
    <>
      <ConfirmChangesModal
        opened={confirmChanges}
        toggle={toggleConfirmChanges}
        closeTab={() => {
          void setPage(tempPage, true);
        }}
      />
      <Stack gap={0} className={classes.switcherRow}>
        <Group wrap="nowrap" gap="xs" px="sm" py="xs">
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label={t("Board.Mobile.Previous")}
            disabled={(gameNumber || 0) <= 0}
            onClick={() => void setPage(Math.max(0, gameNumber - 1))}
          >
            <IconChevronLeft size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="sm"
            aria-label={t("Board.Mobile.Next")}
            disabled={!tabFile.numGames || gameNumber >= tabFile.numGames - 1}
            onClick={() => void setPage(Math.min(gameNumber + 1, tabFile.numGames - 1))}
          >
            <IconChevronRight size="1rem" />
          </ActionIcon>
          <UnstyledButton
            style={{ flex: "1 1 0%", minWidth: 0 }}
            onClick={() => setListOpen(!listOpen)}
            aria-expanded={listOpen}
          >
            {/* The file name (already shown by FileInfo below the switcher)
                stays off this row so the game title can use the width. */}
            <Text truncate size="sm">
              {formatNumber(gameNumber + 1)}. {currentName}
            </Text>
          </UnstyledButton>
          <ActionIcon size="sm" variant="default" onClick={() => setListOpen(!listOpen)}>
            <IconChevronDown
              size="1rem"
              style={{
                transform: listOpen ? "rotate(180deg)" : "none",
                transition: "transform 150ms",
              }}
            />
          </ActionIcon>
          {addGame && (
            <ActionIcon
              variant="subtle"
              size="sm"
              aria-label={t("Board.Action.AddGame")}
              onClick={() => addGame()}
            >
              <IconPlus size="0.9rem" />
            </ActionIcon>
          )}
        </Group>
        {/* One screen-width list row set replaces upstream's 10rem box; the
            height follows the game count so a 1-game file doesn't render a
            tall empty box (rows stay virtualised and capped). */}
        <Collapse in={listOpen}>
          <Box
            px="sm"
            pb="xs"
            style={{ height: Math.min((tabFile.numGames ?? 1) * 31, 192), overflow: "hidden" }}
          >
            <GameSelector
              games={games}
              setGames={setGames}
              setPage={(v: number) => void setPage(v)}
              deleteGame={(index: number) => void deleteGame(index)}
              path={tabFile.path}
              activePage={gameNumber || 0}
              total={tabFile.numGames ?? 0}
            />
          </Box>
        </Collapse>
      </Stack>
    </>
  );
}
