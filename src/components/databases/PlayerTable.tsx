import {
  ActionIcon,
  Center,
  Collapse,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical, IconSearch } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useContext, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { useStore } from "zustand";
import type { Player, PlayerSort } from "@/bindings";
import { query_players } from "@/utils/db";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import { DatabaseViewStateContext } from "./DatabaseViewStateContext";
import GridLayout from "./GridLayout";
import { MobileFilterHeader, MobileRow, MobileRowList } from "./MobileList";
import PlayerCard from "./PlayerCard";
import classes from "./styles.module.css";

function PlayerTable() {
  const { t } = useTranslation();
  const store = useContext(DatabaseViewStateContext)!;
  const portrait = useIsMobilePortrait();

  const file = useStore(store, (s) => s.database?.file)!;
  const query = useStore(store, (s) => s.players.query);
  const setQuery = useStore(store, (s) => s.setPlayersQuery);

  const selectedPlayer = useStore(store, (s) => s.players.selectedPlayer);
  const setSelectedPlayer = useStore(store, (s) => s.setPlayersSelectedPlayer);

  const { data, error, isLoading } = useSWR(["players", file, query], () =>
    query_players(file, query),
  );
  const players = data?.data ?? [];
  const count = data?.count;
  const player = players.find((p) => p.id === selectedPlayer);

  const [open, setOpen] = useState(false);

  useHotkeys("ArrowUp", () => {
    if (selectedPlayer != null) {
      const prevIndex = players.findIndex((p) => p.id === selectedPlayer) - 1;
      if (prevIndex > -1) {
        setSelectedPlayer(players[prevIndex].id);
      }
    }
  });
  useHotkeys("ArrowDown", () => {
    const curIndex = players.findIndex((p) => p.id === selectedPlayer);
    if (curIndex > -1) {
      const nextIndex = curIndex + 1;

      if (nextIndex < (count ?? 0)) {
        setSelectedPlayer(players[nextIndex].id);
      }
    }
  });

  const noPlayersText = error
    ? `${t("Common.Error")}: ${error instanceof Error ? error.message : String(error)}`
    : t("Databases.Player.NoPlayersFound");

  const nameSearch = (
    <TextInput
      style={{ flexGrow: 1 }}
      placeholder={t("Common.Search")}
      leftSection={<IconSearch size="1rem" />}
      value={query.name ?? undefined}
      onChange={(e) =>
        setQuery({
          ...query,
          name: e.currentTarget.value,
          options: {
            ...query.options,
            page: 1,
          },
        })
      }
    />
  );

  const minElo = (
    <NumberInput
      label={t("Databases.Player.MinELO")}
      value={query.range?.[0]}
      onChange={(v) =>
        setQuery({
          ...query,
          range: [(v || 0) as number, query.range?.[1] ?? 3000],
        })
      }
      min={0}
      max={3000}
      step={100}
    />
  );

  const maxElo = (
    <NumberInput
      label={t("Databases.Player.MaxELO")}
      value={query.range?.[1]}
      min={0}
      max={3000}
      step={100}
      onChange={(v) =>
        setQuery({
          ...query,
          range: [query.range?.[0] ?? 0, (v || 3000) as number],
        })
      }
    />
  );

  const preview =
    player != null ? (
      <PlayerCard player={player} file={file} />
    ) : (
      <Center h="100%">
        <Text>{t("Databases.Player.NoSelection")}</Text>
      </Center>
    );

  // Portrait: name rows, ELO bounds in a sheet, and the card as a drill-in.
  if (portrait) {
    return (
      <GridLayout
        selected={player != null}
        onBack={() => setSelectedPlayer(undefined)}
        search={
          <MobileFilterHeader
            opened={open}
            setOpened={setOpen}
            search={nameSearch}
            filters={
              <Stack gap="md">
                {minElo}
                {maxElo}
              </Stack>
            }
          />
        }
        table={
          <MobileRowList
            isLoading={isLoading}
            empty={noPlayersText}
            page={query.options?.page ?? 1}
            totalPages={Math.ceil((count ?? 0) / (query.options.pageSize ?? 25))}
            onPageChange={(page) => setQuery({ ...query, options: { ...query.options, page } })}
          >
            {players.map((p) => (
              <MobileRow key={p.id} onClick={() => setSelectedPlayer(p.id)}>
                <Group gap="xs" wrap="nowrap" justify="space-between">
                  <Text size="sm" fw={500} truncate>
                    {p.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {p.elo ? p.elo : t("Common.Unrated")}
                  </Text>
                </Group>
              </MobileRow>
            ))}
          </MobileRowList>
        }
        preview={preview}
      />
    );
  }

  return (
    <GridLayout
      search={
        <>
          <Flex style={{ alignItems: "center", gap: 10 }}>
            {nameSearch}
            <ActionIcon style={{ flexGrow: 0 }} onClick={() => setOpen((prev) => !prev)}>
              <IconDotsVertical size="1rem" />
            </ActionIcon>
          </Flex>

          <Collapse in={open}>
            <Group mt="md">
              {minElo}
              {maxElo}
            </Group>
          </Collapse>
        </>
      }
      table={
        <DataTable<Player>
          withTableBorder
          highlightOnHover
          records={players}
          fetching={isLoading}
          columns={[
            { accessor: "id", sortable: true },
            { accessor: "name", sortable: true },
            { accessor: "elo", sortable: true },
          ]}
          rowClassName={(r) => (r.id === selectedPlayer ? classes.selected : "")}
          noRecordsText={noPlayersText}
          totalRecords={count!}
          recordsPerPage={query.options.pageSize ?? 25}
          page={query.options?.page ?? 1}
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
            columnAccessor: query.options?.sort || "name",
            direction: query.options?.direction || "desc",
          }}
          onSortStatusChange={(value) =>
            setQuery({
              ...query,
              options: {
                ...query.options!,
                sort: value.columnAccessor as PlayerSort,
                direction: value.direction,
              },
            })
          }
          recordsPerPageOptions={[10, 25, 50]}
          onRowClick={({ index }) => {
            setSelectedPlayer(players[index].id);
          }}
        />
      }
      preview={preview}
    />
  );
}

export default PlayerTable;
