import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Drawer,
  Group,
  InputWrapper,
  Loader,
  Pagination,
  RangeSlider,
  ScrollArea,
  Select,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconFilter } from "@tabler/icons-react";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { NormalizedGame, Outcome } from "@/bindings";
import classes from "./MobileList.module.css";

/**
 * Portrait building blocks for the database tabs.
 *
 * The desktop tabs are a wide `mantine-datatable` next to a preview pane. Both
 * halves want more width than a phone has, so in portrait every row collapses
 * to a tappable card and the preview becomes a drill-in (see `GridLayout`).
 */

/** Shared frame: a search/filter header, a scrolling row list, and paging. */
export function MobileRowList({
  header,
  children,
  isLoading,
  empty,
  page,
  totalPages,
  onPageChange,
}: {
  header?: ReactNode;
  children: ReactNode;
  isLoading: boolean;
  empty: string;
  /** Omit all three paging props for a list that shows everything at once. */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}) {
  const rows = Array.isArray(children) ? children : [children];
  const hasRows = rows.some(Boolean);

  return (
    <Stack gap="xs" h="100%" style={{ overflow: "hidden" }}>
      {header}
      <ScrollArea flex={1} offsetScrollbars>
        {isLoading && (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        )}
        {!isLoading && !hasRows && (
          <Center py="xl">
            <Text c="dimmed" size="sm" ta="center">
              {empty}
            </Text>
          </Center>
        )}
        {!isLoading && hasRows && <Stack gap={6}>{children}</Stack>}
      </ScrollArea>
      {onPageChange && (totalPages ?? 0) > 1 && (
        <Group justify="center" pb={4}>
          <Pagination
            size="sm"
            value={page}
            total={totalPages!}
            onChange={onPageChange}
            siblings={0}
          />
        </Group>
      )}
    </Stack>
  );
}

/**
 * A single tap target. Selecting drills into the preview; see `GridLayout`.
 * Without `onClick` it stays a plain row — used for read-only lists like the
 * tournament leaderboard, which has nothing to drill into.
 */
export function MobileRow({
  onClick,
  selected,
  children,
}: {
  onClick?: () => void;
  selected?: boolean;
  children: ReactNode;
}) {
  const className = selected ? `${classes.row} ${classes.selected}` : classes.row;

  if (!onClick) {
    return <Box className={className}>{children}</Box>;
  }

  return (
    <UnstyledButton className={className} onClick={onClick}>
      {children}
    </UnstyledButton>
  );
}

/** players · result · year · opening, per the mobile plan's row spec. */
export function MobileGameRow({
  game,
  selected,
  onClick,
}: {
  game: NormalizedGame;
  selected?: boolean;
  onClick: () => void;
}) {
  const year = game.date?.slice(0, 4);
  const event = game.event === "?" ? "" : game.event;
  const meta = [game.eco, event, year].filter(Boolean).join(" · ");

  return (
    <MobileRow onClick={onClick} selected={selected}>
      <Group gap="xs" wrap="nowrap" align="center">
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={500} truncate>
            {game.white}
            {game.white_elo ? ` (${game.white_elo})` : ""}
          </Text>
          <Text size="sm" fw={500} truncate>
            {game.black}
            {game.black_elo ? ` (${game.black_elo})` : ""}
          </Text>
          {meta && (
            <Text size="xs" c="dimmed" truncate>
              {meta}
            </Text>
          )}
        </Stack>
        <Badge variant="light" size="sm">
          {game.result?.replaceAll("1/2", "½")}
        </Badge>
      </Group>
    </MobileRow>
  );
}

/**
 * Search plus a Filters button opening a bottom sheet. The sheet body is
 * whatever the caller's desktop `Collapse` held, so both layouts write to the
 * same query object and switching orientation keeps the filters.
 */
export function MobileFilterHeader({
  search,
  filters,
  opened,
  setOpened,
}: {
  search: ReactNode;
  filters?: ReactNode;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <Group gap="xs" wrap="nowrap" align="end">
        <div style={{ flex: 1, minWidth: 0 }}>{search}</div>
        {filters && (
          <ActionIcon
            variant="default"
            size="lg"
            onClick={() => setOpened(true)}
            aria-label={t("Common.Filters")}
          >
            <IconFilter size="1.1rem" />
          </ActionIcon>
        )}
      </Group>
      {filters && (
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          position="bottom"
          size="80%"
          title={t("Common.Filters")}
        >
          <ScrollArea.Autosize mah="70vh" offsetScrollbars>
            <Stack gap="md" pb="md">
              {filters}
            </Stack>
          </ScrollArea.Autosize>
        </Drawer>
      )}
    </>
  );
}

/** The two ELO ranges, result and date bounds, stacked for a narrow sheet. */
export function MobileGameFilters({
  range1,
  range2,
  outcome,
  startDate,
  endDate,
  setRange1,
  setRange2,
  setOutcome,
  setStartDate,
  setEndDate,
}: {
  range1: [number, number] | null | undefined;
  range2: [number, number] | null | undefined;
  outcome: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  setRange1: (value: [number, number]) => void;
  setRange2: (value: [number, number]) => void;
  setOutcome: (value: Outcome | undefined) => void;
  setStartDate: (value: string | undefined) => void;
  setEndDate: (value: string | undefined) => void;
}) {
  const { t } = useTranslation();
  const marks = [
    { value: 1000, label: "1000" },
    { value: 2000, label: "2000" },
    { value: 3000, label: "3000" },
  ];

  return (
    <>
      <InputWrapper label={`${t("Databases.Player.One")} ${t("Databases.Player.ELO")}`}>
        <RangeSlider
          my="md"
          step={10}
          min={0}
          max={3000}
          marks={marks}
          value={range1 ?? undefined}
          onChangeEnd={setRange1}
        />
      </InputWrapper>
      <InputWrapper label={`${t("Databases.Player.Two")} ${t("Databases.Player.ELO")}`}>
        <RangeSlider
          my="md"
          step={10}
          min={0}
          max={3000}
          marks={marks}
          value={range2 ?? undefined}
          onChangeEnd={setRange2}
        />
      </InputWrapper>
      <Select
        label={t("Board.Database.Local.Result")}
        value={outcome}
        onChange={(value) => setOutcome((value as Outcome | null) ?? undefined)}
        clearable
        placeholder={t("Board.Database.Local.Result.Any")}
        data={[
          { label: t("Board.Database.Local.Result.WhiteWon"), value: "1-0" },
          { label: t("Board.Analysis.Tablebase.Draw"), value: "1/2-1/2" },
          { label: t("Board.Database.Local.Result.BlackWon"), value: "0-1" },
        ]}
      />
      <DateInput
        label={t("Common.From")}
        placeholder={t("Common.StartDate")}
        clearable
        valueFormat="YYYY-MM-DD"
        value={startDate ? dayjs(startDate, "YYYY.MM.DD").toDate() : null}
        onChange={(value) => setStartDate(value ? dayjs(value).format("YYYY.MM.DD") : undefined)}
      />
      <DateInput
        label={t("Common.To")}
        placeholder={t("Common.EndDate")}
        clearable
        valueFormat="YYYY-MM-DD"
        value={endDate ? dayjs(endDate, "YYYY.MM.DD").toDate() : null}
        onChange={(value) => setEndDate(value ? dayjs(value).format("YYYY.MM.DD") : undefined)}
      />
    </>
  );
}
