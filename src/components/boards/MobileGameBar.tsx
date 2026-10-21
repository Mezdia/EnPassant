import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowBack,
  IconChevronsLeft,
  IconChevronsRight,
  IconCopy,
  IconFileText,
  IconFlag,
  IconMenu,
  IconPlus,
  IconX,
  IconZoomCheck,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { flipBoardAfterMoveAtom, gamePremovesEnabledAtom, soundVolumeAtom } from "@/state/atoms";
import { usePressHold } from "@/utils/pressHold";
import { TreeStateContext } from "../common/TreeStateContext";
import GameInfo from "../common/GameInfo";
import BoardControls from "./BoardControls";
import classes from "./MobileAnalysisBar.module.css";
import gameClasses from "./MobileGameBar.module.css";

interface MobileGameBarProps {
  playing: boolean;
  gameOver: boolean;
  engineVsEngine: boolean;
  canTakeBack: boolean;
  onResignOrAbort: () => void;
  onNewGame: () => void;
  onAnalyze: () => void;
  onTakeBack: () => void;
  // Set when an engine can be inspected: opens the logs view that replaced
  // the panel's Engine Logs button.
  onToggleLogs?: () => void;
  editingMode: boolean;
  toggleEditingMode: () => void;
}

/** Volume restored when the drawer's sound switch is turned back on. */
const DEFAULT_VOLUME = 0.8;

type PendingConfirmation = "end" | "takeback" | null;

/**
 * The phone action bar for a live game: menu, the game's own action (resign /
 * abort with a confirm, or new game once it's over), a jump into analysis,
 * then the two move steppers with press-and-hold repeat.
 *
 * The menu sheet keeps the reference app's game settings — sound, premoves,
 * auto-flip — plus the pieces of the desktop panel that don't need to be one
 * tap away during play: the takeback, engine logs, the shared control strip
 * and the header editor. Draw offers are deliberately absent: the local game
 * protocol has no draw command.
 */
export function MobileGameBar({
  playing,
  gameOver,
  engineVsEngine,
  canTakeBack,
  onResignOrAbort,
  onNewGame,
  onAnalyze,
  onTakeBack,
  onToggleLogs,
  editingMode,
  toggleEditingMode,
}: MobileGameBarProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState<PendingConfirmation>(null);

  const store = useContext(TreeStateContext)!;
  const headers = useStore(store, (s) => s.headers);
  const previous = useStore(store, (s) => s.goToPrevious);
  const next = useStore(store, (s) => s.goToNext);
  const copyPgn = useStore(store, (s) => s.copyPgn);

  // Guards for the steppers, mirroring the store's own rules; the press-hold
  // repeat stops itself when it walks into either edge.
  const atStart = useStore(store, (s) => s.position.length === 0);
  const atEnd = useStore(store, (s) => !s.currentNode().children.some((c) => c.move));

  const onPrevious = usePressHold(() => {
    if (atStart) return false;
    previous();
  });
  const onNext = usePressHold(() => {
    if (atEnd) return false;
    next();
  });

  const [volume, setVolume] = useAtom(soundVolumeAtom);
  const [premovesEnabled, setPremovesEnabled] = useAtom(gamePremovesEnabledAtom);
  const [autoFlip, setAutoFlip] = useAtom(flipBoardAfterMoveAtom);
  const lastVolume = useRef(volume > 0 ? volume : DEFAULT_VOLUME);

  function toggleSound(checked: boolean) {
    if (checked) {
      setVolume(lastVolume.current || DEFAULT_VOLUME);
    } else {
      lastVolume.current = volume || DEFAULT_VOLUME;
      setVolume(0);
    }
  }

  function handleCopyPgn() {
    copyPgn();
    notifications.show({ message: t("Board.Mobile.PgnCopied") });
  }

  const confirmTitle =
    pending === "takeback"
      ? t("Board.Mobile.Takeback")
      : engineVsEngine
        ? t("Board.Mobile.Abort")
        : t("Board.Mobile.Resign");
  const confirmBody =
    pending === "takeback"
      ? t("Board.Mobile.ConfirmTakeback")
      : engineVsEngine
        ? t("Board.Mobile.ConfirmAbort")
        : t("Board.Mobile.ConfirmResign");

  return (
    <>
      <Group wrap="nowrap" gap={0} h="100%" className={classes.bar}>
        <ActionIcon
          className={classes.button}
          variant="transparent"
          onClick={() => setMenuOpen(true)}
          aria-label={t("Board.Mobile.Menu")}
        >
          <IconMenu size="1.35rem" />
        </ActionIcon>
        {playing && (
          <ActionIcon
            className={classes.button}
            variant="transparent"
            color="red"
            onClick={() => setPending("end")}
            aria-label={engineVsEngine ? t("Board.Mobile.Abort") : t("Board.Mobile.Resign")}
          >
            {engineVsEngine ? <IconX size="1.35rem" /> : <IconFlag size="1.35rem" />}
          </ActionIcon>
        )}
        {gameOver && (
          <ActionIcon
            className={classes.button}
            variant="transparent"
            onClick={onNewGame}
            aria-label={t("Board.Mobile.NewGame")}
          >
            <IconPlus size="1.35rem" />
          </ActionIcon>
        )}
        <ActionIcon
          className={classes.button}
          variant="transparent"
          onClick={onAnalyze}
          aria-label={t("Board.Mobile.Analyze")}
        >
          <IconZoomCheck size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          {...onPrevious}
          className={classes.button}
          variant="transparent"
          disabled={atStart}
          aria-label={t("Board.Mobile.Rewind")}
        >
          <IconChevronsLeft size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          {...onNext}
          className={classes.button}
          variant="transparent"
          disabled={atEnd}
          aria-label={t("Board.Mobile.Forward")}
        >
          <IconChevronsRight size="1.35rem" />
        </ActionIcon>
      </Group>

      <Modal
        opened={pending !== null}
        onClose={() => setPending(null)}
        title={confirmTitle}
        size="xs"
        centered
      >
        <Stack gap="md">
          <Text fz="sm">{confirmBody}</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setPending(null)}>
              {t("Common.Cancel")}
            </Button>
            <Button
              color={pending === "takeback" ? undefined : "red"}
              onClick={() => {
                const action = pending;
                setPending(null);
                if (action === "end") onResignOrAbort();
                else if (action === "takeback") onTakeBack();
              }}
            >
              {t("Board.Opponent.Confirm")}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Drawer
        opened={menuOpen}
        onClose={() => setMenuOpen(false)}
        position="bottom"
        withCloseButton
      >
        <Stack gap="md" className={gameClasses.sheet}>
          <Group justify="space-between" wrap="nowrap" className={gameClasses.settings}>
            <Switch
              size="sm"
              label={t("Board.Mobile.Sound")}
              checked={volume > 0}
              onChange={(e) => toggleSound(e.currentTarget.checked)}
            />
            <Switch
              size="sm"
              label={t("Board.Mobile.Premoves")}
              checked={premovesEnabled}
              onChange={(e) => setPremovesEnabled(e.currentTarget.checked)}
            />
            <Switch
              size="sm"
              label={t("Board.Mobile.AutoFlip")}
              checked={autoFlip}
              onChange={(e) => setAutoFlip(e.currentTarget.checked)}
            />
          </Group>

          {/* The takeback moved off the bar; the confirm dialog is the same. */}
          {playing && canTakeBack && (
            <Button
              variant="default"
              leftSection={<IconArrowBack size="1rem" />}
              onClick={() => {
                setMenuOpen(false);
                setPending("takeback");
              }}
            >
              {t("Board.Mobile.Takeback")}
            </Button>
          )}
          {onToggleLogs && (
            <Button
              variant="default"
              leftSection={<IconFileText size="1rem" />}
              onClick={() => {
                setMenuOpen(false);
                onToggleLogs();
              }}
            >
              {t("Board.Mobile.EngineLogs")}
            </Button>
          )}
          <Button variant="default" leftSection={<IconCopy size="1rem" />} onClick={handleCopyPgn}>
            {t("Board.Mobile.CopyPgn")}
          </Button>

          {/* BoardControls lays its icons out in a column for the notation
              strip; in this sheet it reads as a row of actions. Flip is
              already the analysis bar's job on other tabs, so the row omits
              it here too. */}
          <div className={gameClasses.controls}>
            <BoardControls
              editingMode={editingMode}
              toggleEditingMode={toggleEditingMode}
              dirty={false}
              disableVariations
              allowEditing={playing || gameOver}
              hideFlip
            />
          </div>

          <Divider />

          {/* The header editor the desktop panel keeps; without it the phone
              has nowhere to name the game before it is archived. */}
          <GameInfo headers={headers} />
        </Stack>
      </Drawer>
    </>
  );
}
