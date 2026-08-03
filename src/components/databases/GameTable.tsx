import {
  ActionIcon,
  Box,
  Center,
  Collapse,
  Flex,
  Group,
  InputWrapper,
  RangeSlider,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useHotkeys } from "@mantine/hooks";
import { IconDotsVertical } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAtom, useSetAtom } from "jotai";
import { DataTable } from "mantine-datatable";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { useStore } from "zustand";
import type { GameSort, NormalizedGame, Outcome } from "@/bindings";
import { activeTabAtom, tabsAtom } from "@/state/atoms";
import { query_games } from "@/utils/db";
import { createTab } from "@/utils/tabs";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import { DatabaseViewStateContext } from "./DatabaseViewStateContext";
import GameCard from "./GameCard";
import GridLayout from "./GridLayout";
import { MobileFilterHeader, MobileGameFilters, MobileGameRow, MobileRowList } from "./MobileList";
import { PlayerSearchInput } from "./PlayerSearchInput";
import { SideInput } from "./SideInput";
import classes from "./styles.module.css";

function GameTable() {
  const { t } = useTranslation();
  const store = useContext(DatabaseViewStateContext)!;
  const portrait = useIsMobilePortrait();

  const file = useStore(store, (s) => s.database?.file)!;
  const query = useStore(store, (s) => s.games.query);
  const setQuery = useStore(store, (s) => s.setGamesQuery);
  const openedSettings = useStore(store, (s) => s.games.isFilterExpanded);
  const toggleOpenedSettings = useStore(store, (s) => s.toggleGamesOpenedSettings);

  const selectedGame = useStore(store, (s) => s.games.selectedGame);
  const setSelectedGame = useStore(store, (s) => s.setGamesSelectedGame);

  const navigate = useNavigate();
  const [filtersOpened, setFiltersOpened] = useState(false);

  const [, setTabs] = useAtom(tabsAtom);
  const setActiveTab = useSetAtom(activeTabAtom);

  const { data, error, isLoading, mutate } = useSWR(["games", file, query], () =>
    query_games(file, query),
  );

  const games = data?.data ?? [];
  const count = data?.count;
  const page = query.options?.page ?? 1;
  const pageSize = query.options?.pageSize ?? 25;

  /** Opening a game replaces the board tab, same as the desktop double-click. */
  function openGame(record: NormalizedGame) {
    createTab({
      tab: {
        name: `${record.white} - ${record.black}`,
        type: "analysis",
      },
      setTabs,
      setActiveTab,
      pgn: record.moves,
      headers: record,
      gameOrigin: {
        kind: "database",
        database: file,
        gameId: record.id,
      },
    });
    navigate({ to: "/" });
  }

  useHotkeys([
    [
      "ArrowUp",
      () => {
        setSelectedGame(
          selectedGame === undefined || selectedGame === null
            ? undefined
            : selectedGame === 0
              ? 0
              : selectedGame - 1,
        );
      },
    ],
    [
      "ArrowDown",
      () => {
        setSelectedGame(
          selectedGame === undefined || selectedGame === null
            ? 0
            : selectedGame === games.length - 1
              ? games.length - 1
              : selectedGame + 1,
        );
      },
    ],
  ]);

  const noGamesText = error
    ? `${t("Common.Error")}: ${error instanceof Error ? error.message : String(error)}`
    : t("Databases.Game.NoneFound");

  const playerSearch = (
    <PlayerSearchInput
      value={query?.player1 ?? undefined}
      setValue={(value) => setQuery({ ...query, player1: value })}
      rightSection={
        <SideInput
          sides={query.sides!}
          setSides={(value) => setQuery({ ...query, sides: value })}
          label="Player"
        />
      }
      label={t("Common.Search")}
      file={file}
    />
  );

  const opponentSearch = (
    <PlayerSearchInput
      value={query?.player2 ?? undefined}
      setValue={(value) => setQuery({ ...query, player2: value })}
      rightSection={
        <SideInput
          sides={query.sides!}
          setSides={(value) => setQuery({ ...query, sides: value })}
          label="Opponent"
        />
      }
      label={portrait ? t("Databases.Player.Two") : t("Common.Search")}
      file={file}
    />
  );

  // Portrait: rows instead of the datatable, and a tap opens the board directly
  // rather than a preview pane there is no room for.
  if (portrait) {
    return (
      <GridLayout
        search={
          <MobileFilterHeader
            opened={filtersOpened}
            setOpened={setFiltersOpened}
            search={playerSearch}
            filters={
              <>
                {opponentSearch}
                <MobileGameFilters
                  range1={query.range1}
                  range2={query.range2}
                  outcome={query.outcome}
                  startDate={query.start_date}
                  endDate={query.end_date}
                  setRange1={(range1) => setQuery({ ...query, range1 })}
                  setRange2={(range2) => setQuery({ ...query, range2 })}
                  setOutcome={(outcome) => setQuery({ ...query, outcome })}
                  setStartDate={(start_date) => setQuery({ ...query, start_date })}
                  setEndDate={(end_date) => setQuery({ ...query, end_date })}
                />
              </>
            }
          />
        }
        table={
          <MobileRowList
            isLoading={isLoading}
            empty={noGamesText}
            page={page}
            totalPages={Math.ceil((count ?? 0) / pageSize)}
            onPageChange={(page) => setQuery({ ...query, options: { ...query.options!, page } })}
          >
            {games.map((game) => (
              <MobileGameRow key={game.id} game={game} onClick={() => openGame(game)} />
            ))}
          </MobileRowList>
        }
        preview={null}
      />
    );
  }

  return (
    <GridLayout
      search={
        <Flex style={{ gap: 20 }}>
          <Box style={{ flexGrow: 1 }}>
            <Group grow>
              {playerSearch}
              {opponentSearch}
            </Group>
            <Collapse in={openedSettings} mx={10}>
              <Stack mt="md">
                <Group grow>
                  <InputWrapper label={t("Databases.Player.ELO")}>
                    <RangeSlider
                      step={10}
                      min={0}
                      max={3000}
                      marks={[
                        { value: 1000, label: "1000" },
                        { value: 2000, label: "2000" },
                        { value: 3000, label: "3000" },
                      ]}
                      value={query.range1 ?? undefined}
                      onChangeEnd={(value) => setQuery({ ...query, range1: value })}
                    />
                  </InputWrapper>

                  <InputWrapper label={t("Databases.Player.ELO")}>
                    <RangeSlider
                      step={10}
                      min={0}
                      max={3000}
                      marks={[
                        { value: 1000, label: "1000" },
                        { value: 2000, label: "2000" },
                        { value: 3000, label: "3000" },
                      ]}
                      value={query.range2 ?? undefined}
                      onChangeEnd={(value) => setQuery({ ...query, range2: value })}
                    />
                  </InputWrapper>
                </Group>
                <Select
                  label={t("Board.Database.Local.Result")}
                  value={query.outcome}
                  onChange={(value) =>
                    setQuery({
                      ...query,
                      outcome: (value as Outcome | null) ?? undefined,
                    })
                  }
                  clearable
                  placeholder={t("Board.Database.Local.Result.Any")}
                  data={[
                    {
                      label: t("Board.Database.Local.Result.WhiteWon"),
                      value: "1-0",
                    },
                    {
                      label: t("Board.Database.Local.Result.BlackWon"),
                      value: "0-1",
                    },
                    { label: t("Board.Analysis.Tablebase.Draw"), value: "1/2-1/2" },
                  ]}
                />
                <Group>
                  <DateInput
                    label={t("Common.From")}
                    placeholder={t("Common.StartDate")}
                    clearable
                    valueFormat="YYYY-MM-DD"
                    value={query.start_date ? dayjs(query.start_date, "YYYY.MM.DD").toDate() : null}
                    onChange={(value) =>
                      setQuery({
                        ...query,
                        start_date: value ? dayjs(value).format("YYYY.MM.DD") : undefined,
                      })
                    }
                  />
                  <DateInput
                    label={t("Common.To")}
                    placeholder={t("Common.EndDate")}
                    clearable
                    valueFormat="YYYY-MM-DD"
                    value={query.end_date ? dayjs(query.end_date, "YYYY.MM.DD").toDate() : null}
                    onChange={(value) =>
                      setQuery({
                        ...query,
                        end_date: value ? dayjs(value).format("YYYY.MM.DD") : undefined,
                      })
                    }
                  />
                </Group>
              </Stack>
            </Collapse>
          </Box>
          <ActionIcon style={{ flexGrow: 0 }} onClick={() => toggleOpenedSettings()}>
            <IconDotsVertical size="1rem" />
          </ActionIcon>
        </Flex>
      }
      table={
        <DataTable<NormalizedGame>
          withTableBorder
          highlightOnHover
          records={games}
          fetching={isLoading}
          onRowDoubleClick={({ record }) => openGame(record)}
          columns={[
            {
              accessor: "white",
              render: ({ white, white_elo }) => (
                <div>
                  <Text size="sm" fw={500}>
                    {white}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {white_elo === 0 ? t("Common.Unrated") : white_elo}
                  </Text>
                </div>
              ),
            },
            {
              accessor: "black",
              render: ({ black, black_elo }) => (
                <div>
                  <Text size="sm" fw={500}>
                    {black}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {black_elo === 0 ? t("Common.Unrated") : black_elo}
                  </Text>
                </div>
              ),
            },
            { accessor: "date", sortable: true },
            {
              accessor: "result",
              render: ({ result }) => result?.replaceAll("1/2", "½"),
            },
            { accessor: "ply_count", title: t("Databases.Game.Plies"), sortable: true },
            { accessor: "event" },
            { accessor: "site" },
          ]}
          rowClassName={(_, i) => (i === selectedGame ? classes.selected : "")}
          noRecordsText={noGamesText}
          totalRecords={count!}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(page) =>
            setQuery({
              ...query,
              options: {
                ...query.options!,
                page,
              },
            })
          }
          onRecordsPerPageChange={(value) =>
            setQuery({
              ...query,
              options: { ...query.options!, pageSize: value },
            })
          }
          sortStatus={{
            columnAccessor: query.options?.sort || "date",
            direction: query.options?.direction || "desc",
          }}
          onSortStatusChange={(value) =>
            setQuery({
              ...query,
              options: {
                ...query.options!,
                sort: value.columnAccessor as GameSort,
                direction: value.direction,
              },
            })
          }
          recordsPerPageOptions={[10, 25, 50]}
          onRowClick={({ index }) => {
            setSelectedGame(index);
          }}
        />
      }
      preview={
        selectedGame !== undefined && selectedGame !== null && games[selectedGame] ? (
          <GameCard game={games[selectedGame]} file={file} mutate={mutate} />
        ) : (
          <Center h="100%">
            <Text>{t("Databases.Game.NoSelection")}</Text>
          </Center>
        )
      }
    />
  );
}

export default GameTable;
