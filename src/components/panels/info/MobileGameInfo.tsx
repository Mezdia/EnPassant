import {
  Card,
  Collapse,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconChevronDown } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { createStore, useStore } from "zustand";
import type { Outcome } from "@/bindings";
import { TreeStateContext } from "@/components/common/TreeStateContext";
import FideInfo from "@/components/databases/FideInfo";
import type { GameHeaders } from "@/utils/treeReducer";
import classes from "./MobileInfoPanel.module.css";

/**
 * Phone version of common/GameInfo.tsx. Upstream lays the headers out as a
 * centered "White | event / site / date | Black" line plus a 3-column grid of
 * borderless inputs; on a portrait phone that collapses into an unreadable
 * heap, so this stacks one full-width field per row and parks the rarely
 * edited PGN details behind a disclosure.
 *
 * The setHeaders plumbing mirrors GameInfo field by field — that file stays
 * the source of truth for what each header does; the fork owns only the
 * stacked presentation.
 */

const EMPTY_STORE = createStore(() => ({
  setHeaders: () => {},
}));

function PlayerField(props: {
  caption: string;
  value: string;
  disabled: boolean;
  onOpenFide: () => void;
  onChange: (v: string) => void;
}) {
  return (
    <Stack gap={4}>
      <UnstyledButton className={classes.fieldLabel} onClick={props.onOpenFide}>
        {props.caption}
      </UnstyledButton>
      <TextInput
        size="sm"
        value={props.value}
        disabled={props.disabled}
        placeholder="?"
        onChange={(e) => props.onChange(e.currentTarget.value)}
      />
    </Stack>
  );
}

function DetailField(props: { caption: string; children: React.ReactNode }) {
  return (
    <Stack gap={4}>
      <Text className={classes.fieldLabel}>{props.caption}</Text>
      {props.children}
    </Stack>
  );
}

export default function MobileGameInfo({
  headers,
  changeTitle,
}: {
  headers: GameHeaders;
  changeTitle?: (title: string) => void;
}) {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext) || EMPTY_STORE;
  const disabled = store === EMPTY_STORE;
  const setHeaders = useStore(store, (s) => s.setHeaders);

  const date = headers.date
    ? dayjs(headers.date, "YYYY.MM.DD").isValid()
      ? dayjs(headers.date, "YYYY.MM.DD").toDate()
      : null
    : null;
  const [whiteOpened, setWhiteOpened] = useState(false);
  const [blackOpened, setBlackOpened] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const event = headers.event === "?" ? "" : headers.event;
  const site = headers.site === "?" ? "" : headers.site;
  const isGameUrl =
    headers.site.startsWith("https://lichess.org") ||
    headers.site.startsWith("https://www.chess.com");

  return (
    <Card withBorder radius="md" padding="sm">
      <FideInfo opened={whiteOpened} setOpened={setWhiteOpened} name={headers.white} />
      <FideInfo opened={blackOpened} setOpened={setBlackOpened} name={headers.black} />
      <Stack gap="sm">
        <PlayerField
          caption="White"
          value={headers.white}
          disabled={disabled}
          onOpenFide={() => setWhiteOpened(true)}
          onChange={(v) => setHeaders({ ...headers, white: v })}
        />
        <PlayerField
          caption="Black"
          value={headers.black}
          disabled={disabled}
          onOpenFide={() => setBlackOpened(true)}
          onChange={(v) => setHeaders({ ...headers, black: v })}
        />
        <Group grow gap="sm">
          <Select
            allowDeselect={false}
            data={["1-0", "0-1", "1/2-1/2", "*"]}
            value={headers.result}
            readOnly={disabled}
            rightSection={null}
            rightSectionWidth={0}
            styles={{ input: { textAlign: "center" } }}
            onChange={(result) =>
              setHeaders({
                ...headers,
                result: result as Outcome,
              })
            }
          />
          <DateInput
            size="sm"
            variant="default"
            valueFormat="YYYY.MM.DD"
            placeholder="????.??.??"
            value={date}
            allowDeselect
            readOnly={disabled}
            width="100%"
            onChange={(date) =>
              setHeaders({
                ...headers,
                date: date ? dayjs(date).format("YYYY.MM.DD") : undefined,
              })
            }
          />
        </Group>

        {/* The rarely edited PGN tags stay reachable but out of the way — on
            paper they sit in a wire frame far below the players. */}
        <UnstyledButton
          className={classes.fieldLabel}
          onClick={() => setDetailsOpen(!detailsOpen)}
          style={{ display: "flex", width: "100%" }}
        >
          <Group justify="space-between" w="100%">
            <Text size="0.75rem" style={{ fontWeight: 700, textTransform: "uppercase" }}>
              {t("Info.Mobile.Details")}
            </Text>
            <IconChevronDown
              size="1rem"
              style={{
                transform: detailsOpen ? "rotate(180deg)" : "none",
                transition: "transform 150ms",
              }}
            />
          </Group>
        </UnstyledButton>
        <Collapse in={detailsOpen}>
          <Stack gap="sm">
            <DetailField caption="Event">
              <TextInput
                size="sm"
                value={event}
                disabled={disabled}
                placeholder="Unknown Event"
                onChange={(e) => {
                  setHeaders({
                    ...headers,
                    event: e.currentTarget.value,
                  });
                  changeTitle?.(e.currentTarget.value);
                }}
              />
            </DetailField>
            <DetailField caption="Round">
              <Group gap="xs" wrap="nowrap">
                {/* An inline bare input, as on the desktop, keeps the round
                    inside its "-" opener. */}
                <input
                  className={classes.roundInput}
                  placeholder="?"
                  value={headers.round || ""}
                  disabled={disabled}
                  onChange={(e) => setHeaders({ ...headers, round: e.currentTarget.value })}
                />
              </Group>
            </DetailField>
            <DetailField caption="Site">
              {isGameUrl ? (
                <a href={headers.site} target="_blank" rel="noreferrer">
                  <Text size="sm">
                    {headers.site.startsWith("https://lichess.org") ? "Lichess" : "Chess.com"}
                  </Text>
                </a>
              ) : (
                <TextInput
                  size="sm"
                  value={site}
                  disabled={disabled}
                  placeholder="Unknown Site"
                  onChange={(e) => {
                    setHeaders({
                      ...headers,
                      site: e.currentTarget.value,
                    });
                  }}
                />
              )}
            </DetailField>
            <DetailField caption="White ELO">
              {/* Mirrors GameInfo's ELO parsing: "-" / "unrated" is stored as
                  0, anything unparsable clears the tag. */}
              <TextInput
                size="sm"
                inputMode="numeric"
                placeholder="Unknown ELO"
                value={headers.white_elo === 0 ? "Unrated" : headers.white_elo || ""}
                disabled={disabled}
                onChange={(n) => {
                  const val = n.currentTarget.value;
                  setHeaders({
                    ...headers,
                    white_elo:
                      val.toLowerCase() === "unrated" || val === "-"
                        ? 0
                        : val === "" || Number.isNaN(Number.parseInt(val))
                          ? undefined
                          : Number.parseInt(val),
                  });
                }}
              />
            </DetailField>
            <DetailField caption="Black ELO">
              <TextInput
                size="sm"
                inputMode="numeric"
                placeholder="Unknown ELO"
                value={headers.black_elo === 0 ? "Unrated" : headers.black_elo || ""}
                disabled={disabled}
                onChange={(n) => {
                  const val = n.currentTarget.value;
                  setHeaders({
                    ...headers,
                    black_elo:
                      val.toLowerCase() === "unrated" || val === "-"
                        ? 0
                        : val === "" || Number.isNaN(Number.parseInt(val))
                          ? undefined
                          : Number.parseInt(val),
                  });
                }}
              />
            </DetailField>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
}
