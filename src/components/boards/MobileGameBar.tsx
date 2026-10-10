import { ActionIcon, Drawer, Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconFlag,
  IconMenu,
  IconPlus,
  IconX,
  IconZoomCheck,
} from "@tabler/icons-react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { TreeStateContext } from "../common/TreeStateContext";
import BoardControls from "./BoardControls";
import classes from "./MobileAnalysisBar.module.css";

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

/**
 * The phone action bar for a live game: menu, the game's own action (resign,
 * abort or a new game), a jump into analysis, then the two move steppers — the
 * set the reference app keeps on screen while you play.
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

  const store = useContext(TreeStateContext)!;
  const previous = useStore(store, (s) => s.goToPrevious);
  const next = useStore(store, (s) => s.goToNext);

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
            onClick={onResignOrAbort}
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

      <Drawer
        opened={menuOpen}
        onClose={() => setMenuOpen(false)}
        position="bottom"
        withCloseButton
      >
        <div className={classes.actions}>
          <BoardControls
            editingMode={editingMode}
            toggleEditingMode={toggleEditingMode}
            dirty={false}
            canTakeBack={canTakeBack}
            onTakeBack={onTakeBack}
            disableVariations
            allowEditing={playing || gameOver}
          />
        </div>
      </Drawer>
    </>
  );
}
