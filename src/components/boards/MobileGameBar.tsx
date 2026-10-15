import { ActionIcon, Button, Drawer, Group, Modal, Stack, Switch, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowBack,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
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
import { TreeStateContext } from "../common/TreeStateContext";
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
  editingMode: boolean;
  toggleEditingMode: () => void;
}

/** Volume restored when the drawer's sound switch is turned back on. */
const DEFAULT_VOLUME = 0.8;

type PendingConfirmation = "end" | "takeback" | null;

/**
 * The phone action bar for a live game: menu, the game's own actions (resign /
 * abort with a confirm, and the takeback the reference app keeps on screen), a
 * jump into analysis, then the two move steppers.
 *
 * The menu sheet groups the reference app's game settings — sound, premoves,
 * auto-flip — on one switch row above the shared BoardControls row; the
 * takeback lives on the bar now, so the drawer no longer duplicates it. Draw
 * offers are deliberately absent: the local game protocol has no draw command.
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
  editingMode,
  toggleEditingMode,
}: MobileGameBarProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState<PendingConfirmation>(null);

  const store = useContext(TreeStateContext)!;
  const previous = useStore(store, (s) => s.goToPrevious);
  const next = useStore(store, (s) => s.goToNext);
  const copyPgn = useStore(store, (s) => s.copyPgn);

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
        {playing && canTakeBack && (
          <ActionIcon
            className={classes.button}
            variant="transparent"
            onClick={() => setPending("takeback")}
            aria-label={t("Board.Mobile.Takeback")}
          >
            <IconArrowBack size="1.35rem" />
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
          className={classes.button}
          variant="transparent"
          onClick={previous}
          aria-label={t("Board.Mobile.Previous")}
        >
          <IconChevronLeft size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          className={classes.button}
          variant="transparent"
          onClick={next}
          aria-label={t("Board.Mobile.Next")}
        >
          <IconChevronRight size="1.35rem" />
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
        <Stack gap="md">
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
          <Button variant="default" leftSection={<IconCopy size="1rem" />} onClick={handleCopyPgn}>
            {t("Board.Mobile.CopyPgn")}
          </Button>
          <div className={classes.actions}>
            <BoardControls
              editingMode={editingMode}
              toggleEditingMode={toggleEditingMode}
              dirty={false}
              disableVariations
              allowEditing={playing || gameOver}
            />
          </div>
        </Stack>
      </Drawer>
    </>
  );
}
