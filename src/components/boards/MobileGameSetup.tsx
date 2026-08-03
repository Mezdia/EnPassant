import {
  Alert,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  InputWrapper,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCpu, IconInfoCircle, IconUser } from "@tabler/icons-react";
import type { TFunction } from "i18next";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GoModeInput from "@/components/common/GoModeInput";
import TimeInput from "@/components/common/TimeInput";
import EngineSettingsForm from "@/components/panels/analysis/EngineSettingsForm";
import {
  enginesAtom,
  gameInputColorAtom,
  gamePlayer1SettingsAtom,
  gamePlayer2SettingsAtom,
  gameSameTimeControlAtom,
} from "@/state/atoms";
import { isAndroid } from "@/utils/platform";
import { EnginesSelect } from "./EnginesSelect";
import { DEFAULT_TIME_CONTROL, type OpponentSettings } from "./OpponentForm";

/**
 * Mobile replacement for the desktop two-column `OpponentForm` setup screen.
 *
 * The desktop form puts both players, both time controls and the opening-book
 * options on one dense page. On a phone that is several screens of scrolling,
 * so this splits it into a three step wizard — sides → time control → confirm —
 * writing to the exact same atoms, which means `BoardGame.startGame` needs no
 * changes.
 */

const STEP_COUNT = 3;

export function MobileGameSetup({ onStart, disabled }: { onStart: () => void; disabled: boolean }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const [inputColor, setInputColor] = useAtom(gameInputColorAtom);
  const [player1, setPlayer1] = useAtom(gamePlayer1SettingsAtom);
  const [player2, setPlayer2] = useAtom(gamePlayer2SettingsAtom);
  const [sameTimeControl, setSameTimeControl] = useAtom(gameSameTimeControlAtom);

  const next = () => setStep((s) => Math.min(STEP_COUNT - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Stack h="100%" gap="xs">
      <Stepper active={step} onStepClick={setStep} size="sm" iconSize={28}>
        <Stepper.Step label={t("Board.Opponent.Players")} />
        <Stepper.Step label={t("Board.Opponent.TimeSettings")} />
        <Stepper.Step label={t("Board.Opponent.Confirm")} />
      </Stepper>

      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        {step === 0 && (
          <Stack>
            <InputWrapper label={t("Board.Opponent.YouPlay")}>
              <SegmentedControl
                fullWidth
                data={[
                  { value: "white", label: t("Fen.White") },
                  { value: "random", label: t("Board.Opponent.Random") },
                  { value: "black", label: t("Fen.Black") },
                ]}
                value={inputColor}
                onChange={(v) => setInputColor(v as "white" | "black" | "random")}
              />
            </InputWrapper>

            <PlayerCard
              title={playerLabel(t, inputColor, 1)}
              opponent={player1}
              setOpponent={setPlayer1}
            />
            <PlayerCard
              title={playerLabel(t, inputColor, 2)}
              opponent={player2}
              setOpponent={setPlayer2}
            />
          </Stack>
        )}

        {step === 1 && (
          <Stack>
            <Checkbox
              label={t("Board.Opponent.SameTimeControl")}
              checked={sameTimeControl}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                setSameTimeControl(checked);
                if (checked) {
                  setPlayer2((prev) => ({
                    ...prev,
                    timeControl: player1.timeControl,
                    timeUnit: player1.timeUnit,
                    incrementUnit: player1.incrementUnit,
                  }));
                }
              }}
            />

            <TimeControlCard
              title={
                sameTimeControl ? t("Board.Opponent.TimeSettings") : playerLabel(t, inputColor, 1)
              }
              opponent={player1}
              setOpponent={setPlayer1}
              setOtherOpponent={setPlayer2}
              mirror={sameTimeControl}
            />
            {!sameTimeControl && (
              <TimeControlCard
                title={playerLabel(t, inputColor, 2)}
                opponent={player2}
                setOpponent={setPlayer2}
                setOtherOpponent={setPlayer1}
                mirror={false}
              />
            )}
          </Stack>
        )}

        {step === 2 && (
          <Stack>
            <Paper withBorder p="sm">
              <Stack gap="xs">
                <SummaryRow
                  label={playerLabel(t, inputColor, 1)}
                  value={describePlayer(t, player1)}
                />
                <SummaryRow
                  label={playerLabel(t, inputColor, 2)}
                  value={describePlayer(t, player2)}
                />
                <Divider variant="dashed" />
                <SummaryRow
                  label={t("Board.Opponent.TimeSettings")}
                  value={describeTimeControls(t, player1, player2, sameTimeControl)}
                />
              </Stack>
            </Paper>
            <Button onClick={onStart} fullWidth variant="light" disabled={disabled}>
              {t("Board.Opponent.StartGame")}
            </Button>
          </Stack>
        )}
      </ScrollArea>

      <Group grow>
        <Button variant="default" onClick={back} disabled={step === 0}>
          {t("Board.Opponent.Back")}
        </Button>
        <Button variant="default" onClick={next} disabled={step === STEP_COUNT - 1}>
          {t("Board.Opponent.Next")}
        </Button>
      </Group>
    </Stack>
  );
}

/** "White" / "Black" once the side is fixed, otherwise the neutral player number. */
function playerLabel(
  t: TFunction,
  inputColor: "white" | "black" | "random",
  player: 1 | 2,
): string {
  if (inputColor === "random") {
    return `${t("Board.Opponent.Player")} ${player}`;
  }
  const isWhite = inputColor === "white" ? player === 1 : player === 2;
  return isWhite ? t("Fen.White") : t("Fen.Black");
}

function describePlayer(t: TFunction, opponent: OpponentSettings): string {
  if (opponent.type === "human") {
    return opponent.name || t("Board.Opponent.Human");
  }
  return opponent.engine?.name ?? t("Common.Engine");
}

function formatTimeControl(t: TFunction, opponent: OpponentSettings): string {
  if (!opponent.timeControl) return t("Board.Opponent.Unlimited");
  const minutes = opponent.timeControl.seconds / 60_000;
  const increment = (opponent.timeControl.increment ?? 0) / 1000;
  return `${trimNumber(minutes)}+${trimNumber(increment)}`;
}

function describeTimeControls(
  t: TFunction,
  player1: OpponentSettings,
  player2: OpponentSettings,
  sameTimeControl: boolean,
): string {
  const first = formatTimeControl(t, player1);
  if (sameTimeControl) return first;
  const second = formatTimeControl(t, player2);
  return first === second ? first : `${first} / ${second}`;
}

function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="sm">
      <Text c="dimmed" fz="sm">
        {label}
      </Text>
      <Text fz="sm" fw="bold" ta="right" style={{ wordBreak: "break-word" }}>
        {value}
      </Text>
    </Group>
  );
}

function PlayerCard({
  title,
  opponent,
  setOpponent,
}: {
  title: string;
  opponent: OpponentSettings;
  setOpponent: React.Dispatch<React.SetStateAction<OpponentSettings>>;
}) {
  const { t } = useTranslation();
  const allEngines = useAtomValue(enginesAtom);
  const hasLocalEngine = (allEngines ?? []).some((e) => e.type === "local");

  function updateType(type: "engine" | "human") {
    if (type === "human") {
      setOpponent((prev) => ({ ...prev, type: "human", name: "Player" }));
    } else {
      setOpponent((prev) => ({
        ...prev,
        type: "engine",
        engine: null,
        go: ("go" in prev && prev.go) || { t: "Depth", c: 24 },
      }));
    }
  }

  return (
    <Paper withBorder p="sm">
      <Stack gap="sm">
        <Text fz="sm" fw="bold">
          {title}
        </Text>
        <SegmentedControl
          fullWidth
          data={[
            {
              value: "human",
              label: (
                <Center style={{ gap: 8 }}>
                  <IconUser size={16} />
                  <span>{t("Board.Opponent.Human")}</span>
                </Center>
              ),
            },
            {
              value: "engine",
              label: (
                <Center style={{ gap: 8 }}>
                  <IconCpu size={16} />
                  <span>{t("Common.Engine")}</span>
                </Center>
              ),
            },
          ]}
          value={opponent.type}
          onChange={(v) => updateType(v as "human" | "engine")}
        />

        {opponent.type === "human" && (
          <TextInput
            value={opponent.name ?? ""}
            onChange={(e) => setOpponent((prev) => ({ ...prev, name: e.target.value }))}
          />
        )}

        {opponent.type === "engine" && (
          <>
            {isAndroid() && !hasLocalEngine && (
              <Alert
                variant="light"
                color="blue"
                icon={<IconInfoCircle size="1rem" />}
                p="xs"
                title={t("Board.Opponent.NoLocalEngines")}
              >
                <Text fz="xs">{t("Board.Opponent.AndroidEngineNote")}</Text>
              </Alert>
            )}
            <EnginesSelect
              engine={opponent.engine}
              setEngine={(engine) =>
                setOpponent((prev) => ({
                  ...prev,
                  engine,
                  engineSettings: engine?.settings || undefined,
                }))
              }
            />
            {opponent.engine && (
              <EngineSettingsForm
                engine={opponent.engine}
                remote={false}
                gameMode
                settings={{
                  go: opponent.go,
                  settings: opponent.engineSettings || opponent.engine.settings || [],
                  enabled: true,
                  synced: false,
                }}
                setSettings={(fn) =>
                  setOpponent((prev) => {
                    if (prev.type === "human") return prev;
                    const newSettings = fn({
                      go: prev.go,
                      settings: prev.engineSettings || prev.engine?.settings || [],
                      enabled: true,
                      synced: false,
                    });
                    return {
                      ...prev,
                      go: newSettings.go,
                      engineSettings: newSettings.settings,
                    };
                  })
                }
                minimal={true}
              />
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
}

function TimeControlCard({
  title,
  opponent,
  setOpponent,
  setOtherOpponent,
  mirror,
}: {
  title: string;
  opponent: OpponentSettings;
  setOpponent: React.Dispatch<React.SetStateAction<OpponentSettings>>;
  setOtherOpponent: React.Dispatch<React.SetStateAction<OpponentSettings>>;
  mirror: boolean;
}) {
  const { t } = useTranslation();

  /** Applies `update` to this player, and to the other one when time controls are linked. */
  const apply = (update: (prev: OpponentSettings) => OpponentSettings) => {
    setOpponent(update);
    if (mirror) setOtherOpponent(update);
  };

  return (
    <Paper withBorder p="sm">
      <Stack gap="sm">
        <Text fz="sm" fw="bold">
          {title}
        </Text>
        <SegmentedControl
          fullWidth
          data={[
            { value: "time", label: t("GoMode.Time") },
            { value: "unlimited", label: t("Board.Opponent.Unlimited") },
          ]}
          value={opponent.timeControl ? "time" : "unlimited"}
          onChange={(v) =>
            apply((prev) => ({
              ...prev,
              timeControl: v === "time" ? DEFAULT_TIME_CONTROL : undefined,
            }))
          }
        />

        {opponent.timeControl && (
          <Group grow wrap="nowrap">
            <InputWrapper label={t("GoMode.Time")}>
              <TimeInput
                defaultType="m"
                type={opponent.timeUnit}
                onTypeChange={(unit) => apply((prev) => ({ ...prev, timeUnit: unit }))}
                value={opponent.timeControl.seconds}
                setValue={(v) =>
                  apply((prev) => ({
                    ...prev,
                    timeControl: {
                      seconds: v.t === "Time" ? v.c : 0,
                      increment: prev.timeControl?.increment ?? 0,
                    },
                  }))
                }
              />
            </InputWrapper>
            <InputWrapper label={t("Board.Opponent.Increment")}>
              <TimeInput
                defaultType="s"
                type={opponent.incrementUnit}
                onTypeChange={(unit) => apply((prev) => ({ ...prev, incrementUnit: unit }))}
                value={opponent.timeControl.increment ?? 0}
                setValue={(v) =>
                  apply((prev) => ({
                    ...prev,
                    timeControl: {
                      seconds: prev.timeControl?.seconds ?? 0,
                      increment: v.t === "Time" ? v.c : 0,
                    },
                  }))
                }
              />
            </InputWrapper>
          </Group>
        )}

        {opponent.type === "engine" && !opponent.timeControl && (
          <GoModeInput
            gameMode
            goMode={opponent.go}
            setGoMode={(go) =>
              setOpponent((prev) => (prev.type === "human" ? prev : { ...prev, go }))
            }
          />
        )}
      </Stack>
    </Paper>
  );
}
