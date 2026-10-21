import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Checkbox,
  Chip,
  Group,
  InputWrapper,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconArrowLeft, IconCpu, IconInfoCircle, IconUser } from "@tabler/icons-react";
import type { TFunction } from "i18next";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import GoModeInput from "@/components/common/GoModeInput";
import TimeInput from "@/components/common/TimeInput";
import EngineSettingsForm from "@/components/panels/analysis/EngineSettingsForm";
import {
  activeTabAtom,
  enginesAtom,
  gameInputColorAtom,
  gamePlayer1SettingsAtom,
  gamePlayer2SettingsAtom,
  gameSameTimeControlAtom,
  tabsAtom,
} from "@/state/atoms";
import { isAndroid } from "@/utils/platform";
import { EnginesSelect } from "./EnginesSelect";
import { DEFAULT_TIME_CONTROL, type OpponentSettings } from "./OpponentForm";

/**
 * Mobile replacement for the desktop two-column `OpponentForm` setup screen.
 *
 * The desktop form puts both players, both time controls and the opening-book
 * options on one dense page. On a phone that page collapses to a single
 * scrollable form, presented in the order the reference app's new-game sheet
 * uses: side first, then quick time presets, then the players. It writes to
 * the exact same atoms, so `BoardGame.startGame` needs no changes.
 */

/** The quick-pairing presets, phrased like the reference app's pools. */
const TIME_PRESETS = [
  { minutes: 1, increment: 0, label: "1+0" },
  { minutes: 3, increment: 0, label: "3+0" },
  { minutes: 3, increment: 2, label: "3+2" },
  { minutes: 5, increment: 0, label: "5+0" },
  { minutes: 5, increment: 3, label: "5+3" },
  { minutes: 10, increment: 0, label: "10+0" },
  { minutes: 10, increment: 5, label: "10+5" },
  { minutes: 15, increment: 10, label: "15+10" },
  { minutes: 30, increment: 20, label: "30+20" },
] as const;

export function MobileGameSetup({ onStart, disabled }: { onStart: () => void; disabled: boolean }) {
  const { t } = useTranslation();

  const [inputColor, setInputColor] = useAtom(gameInputColorAtom);
  const [player1, setPlayer1] = useAtom(gamePlayer1SettingsAtom);
  const [player2, setPlayer2] = useAtom(gamePlayer2SettingsAtom);
  const [sameTimeControl, setSameTimeControl] = useAtom(gameSameTimeControlAtom);

  const [tabs, setTabs] = useAtom(tabsAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  /** Leaving the page closes the board tab it was opened in; BoardsPage
   *  recreates a home tab once none are left. A tab still in setup never
   *  started an engine or a game, so unlike BoardsPage.closeTab there is
   *  nothing to tear down here. */
  const cancel = useCallback(() => {
    const index = tabs.findIndex((tab) => tab.value === activeTab);
    setActiveTab(
      tabs.length > 1 ? tabs[index === tabs.length - 1 ? index - 1 : index + 1].value : null,
    );
    setTabs((prev) => prev.filter((tab) => tab.value !== activeTab));
  }, [tabs, activeTab, setActiveTab, setTabs]);

  // Android's system back button reaches the WebView as window.history, and
  // this page is plain state, so claim a history entry while it is on screen
  // and use the pop to leave. Spreading history.state keeps the router's own
  // entry state intact.
  const cancelRef = useRef(cancel);
  cancelRef.current = cancel;
  useEffect(() => {
    history.pushState({ ...history.state, enpassantWizard: true }, "");
    const onPop = () => cancelRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Selecting a preset is a quick pairing: both players get the same control,
  // like the reference app's pools.
  const applyPreset = (preset: (typeof TIME_PRESETS)[number]) => {
    const timeControl = {
      seconds: preset.minutes * 60_000,
      increment: preset.increment * 1000,
    };
    setSameTimeControl(true);
    setPlayer1((prev) => ({ ...prev, timeControl, timeUnit: "m", incrementUnit: "s" as const }));
    setPlayer2((prev) => ({ ...prev, timeControl, timeUnit: "m", incrementUnit: "s" as const }));
  };

  return (
    <Stack h="100%" gap="sm">
      <Group gap="xs" wrap="nowrap" align="center">
        <ActionIcon variant="subtle" onClick={cancel} aria-label={t("Common.Back")}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Text fz="lg" fw={700}>
          {t("Board.Mobile.NewGame")}
        </Text>
      </Group>

      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        <Stack gap="sm">
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

          <div>
            <Text fz="sm" fw={500} mb={4}>
              {t("Board.Mobile.QuickPairing")}
            </Text>
            <Group gap="xs" wrap="wrap">
              {TIME_PRESETS.map((preset) => {
                const active =
                  sameTimeControl &&
                  player1.timeControl?.seconds === preset.minutes * 60_000 &&
                  player1.timeControl?.increment === preset.increment * 1000;
                return (
                  <Chip
                    key={preset.label}
                    checked={active}
                    onChange={(checked) => checked && applyPreset(preset)}
                  >
                    {preset.label}
                  </Chip>
                );
              })}
            </Group>
          </div>

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
      </ScrollArea>

      <Button size="lg" onClick={onStart} disabled={disabled} fullWidth>
        {t("Board.Opponent.StartGame")}
      </Button>
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
