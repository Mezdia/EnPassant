import { ActionIcon, Group, Paper, Stack, Tabs, Text, useMantineTheme } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom, useSetAtom } from "jotai";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWRImmutable from "swr/immutable";
import { match } from "ts-pattern";
import { useStore } from "zustand";
import type { Event, NormalizedGame } from "@/bindings";
import { activeTabAtom, tabsAtom } from "@/state/atoms";
import type { DatabaseViewStore } from "@/state/store/database";
import { getTournamentGames } from "@/utils/db";
import { createTab } from "@/utils/tabs";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import { DatabaseViewStateContext } from "./DatabaseViewStateContext";
import { MobileGameRow, MobileRow, MobileRowList } from "./MobileList";

const gamePoints = (game: NormalizedGame, player: string) => {
  if (game.white === player) {
    return match(game.result)
      .with("1-0", () => 1)
      .with("0-1", () => 0)
      .with("1/2-1/2", () => 0.5)
      .otherwise(() => 0);
  }
  return match(game.result)
    .with("1-0", () => 0)
    .with("0-1", () => 1)
    .with("1/2-1/2", () => 0.5)
    .otherwise(() => 0);
};

function TournamentCard({ tournament, file }: { tournament: Event; file: string }) {
  const { t } = useTranslation();
  const store = useContext(DatabaseViewStateContext)!;
  const tournamentsActiveTab = useStore(store, (s) => s.tournaments.activeTab);
  const setTournamentsActiveTab = useStore(store, (s) => s.setTournamentsActiveTab);
  const portrait = useIsMobilePortrait();

  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [, setTabs] = useAtom(tabsAtom);
  const setActiveTab = useSetAtom(activeTabAtom);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { data: games, isLoading } = useSWRImmutable(
    ["tournament-games", file, tournament.id],
    async ([key, file, id]) => {
      const games = await getTournamentGames(file, id);
      return games.data;
    },
  );

  const [sort, setSort] = useState<DataTableSortStatus<NormalizedGame>>({
    columnAccessor: "date",
    direction: "asc",
  });

  const sortedGames =
    games?.sort((a, b) => {
      const key = sort.columnAccessor;
      if (sort.direction === "asc") {
        /// @ts-expect-error we know they're the same type
        return a[key] > b[key] ? 1 : -1;
      }
      /// @ts-expect-error we know they're the same type
      return a[key] < b[key] ? 1 : -1;
    }) || [];

  const players =
    games?.reduce(
      (acc, game) => {
        const whitePlayer = acc.find((p) => p.name === game.white);
        const blackPlayer = acc.find((p) => p.name === game.black);
        if (!whitePlayer) {
          acc.push({
            name: game.white,
            points: gamePoints(game, game.white),
          });
        } else {
          whitePlayer.points += gamePoints(game, game.white);
        }

        if (!blackPlayer) {
          acc.push({
            name: game.black,
            points: gamePoints(game, game.black),
          });
        } else {
          blackPlayer.points += gamePoints(game, game.black);
        }

        return acc;
      },
      [] as { name: string; points: number }[],
    ) || [];

  players.sort(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  );

  const paginatedGames = sortedGames.slice((page - 1) * 25, (page - 1) * 25 + 25);

  /** Same jump the eye button does, shared with the portrait rows. */
  function openGame(game: NormalizedGame) {
    createTab({
      tab: {
        name: `${game.white} - ${game.black}`,
        type: "analysis",
      },
      setTabs,
      setActiveTab,
      pgn: game.moves,
      headers: game,
      gameOrigin: {
        kind: "database",
        database: file,
        gameId: game.id,
      },
    });
    navigate({ to: "/" });
  }

  return (
    <Paper shadow="sm" p="sm" withBorder h="100%">
      <Stack h="100%">
        <Text fz="lg" fw={500}>
          {tournament.name}
        </Text>
        <Tabs
          value={tournamentsActiveTab}
          onChange={(tab) =>
            setTournamentsActiveTab(tab as DatabaseViewStore["tournaments"]["activeTab"])
          }
          style={{ flexDirection: "column", overflow: "hidden" }}
          display="flex"
          h="100%"
        >
          <Tabs.List>
            <Tabs.Tab value="games">{t("Common.Games")}</Tabs.Tab>
            <Tabs.Tab value="leaderboard">{t("Databases.Tournament.Leaderboard")}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="games" flex={1} style={{ overflow: "hidden" }}>
            {portrait ? (
              <MobileRowList
                isLoading={isLoading}
                empty={t("Databases.Game.NoneFound")}
                page={page}
                totalPages={Math.ceil(sortedGames.length / pageSize)}
                onPageChange={setPage}
              >
                {paginatedGames.map((game) => (
                  <MobileGameRow key={game.id} game={game} onClick={() => openGame(game)} />
                ))}
              </MobileRowList>
            ) : (
              <DataTable<NormalizedGame>
                fetching={isLoading}
                withTableBorder
                highlightOnHover
                records={paginatedGames}
                totalRecords={sortedGames.length}
                recordsPerPage={pageSize}
                onRecordsPerPageChange={setPageSize}
                recordsPerPageOptions={[10, 25, 50]}
                page={page}
                onPageChange={setPage}
                sortStatus={sort}
                onSortStatusChange={setSort}
                columns={[
                  {
                    accessor: "actions",
                    title: "",
                    render: (game) => (
                      <ActionIcon
                        variant="filled"
                        color={theme.primaryColor}
                        onClick={() => openGame(game)}
                      >
                        <IconEye size="1rem" stroke={1.5} />
                      </ActionIcon>
                    ),
                  },
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
                  { accessor: "result" },
                  { accessor: "ply_count", sortable: true },
                ]}
                noRecordsText={t("Databases.Game.NoneFound")}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value="leaderboard" flex={1} style={{ overflow: "hidden" }}>
            {portrait ? (
              <MobileRowList isLoading={isLoading} empty={t("Databases.Player.NoPlayersFound")}>
                {players.map((player, index) => (
                  <MobileRow key={player.name}>
                    <Group gap="xs" wrap="nowrap" justify="space-between">
                      <Text size="sm" c="dimmed" w="1.5rem">
                        {index + 1}
                      </Text>
                      <Text size="sm" fw={500} truncate style={{ flex: 1, minWidth: 0 }}>
                        {player.name}
                      </Text>
                      <Text size="sm" fw={500}>
                        {player.points}
                      </Text>
                    </Group>
                  </MobileRow>
                ))}
              </MobileRowList>
            ) : (
              <DataTable
                fetching={isLoading}
                withTableBorder
                highlightOnHover
                records={players}
                columns={[
                  {
                    accessor: "rank",
                    title: "#",
                    width: "2.5rem",
                    render: (player, index) => (
                      <Text size="sm" fw={500}>
                        {index + 1}
                      </Text>
                    ),
                  },
                  {
                    accessor: "name",
                    title: t("Board.Opponent.Player"),
                    render: (player) => (
                      <Text size="sm" fw={500}>
                        {player.name}
                      </Text>
                    ),
                  },
                  {
                    accessor: "points",
                    title: t("Databases.Tournament.Points"),
                    render: (player) => (
                      <Text size="sm" fw={500}>
                        {player.points}
                      </Text>
                    ),
                  },
                ]}
                noRecordsText={t("Databases.Player.NoPlayersFound")}
              />
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Paper>
  );
}

export default TournamentCard;
