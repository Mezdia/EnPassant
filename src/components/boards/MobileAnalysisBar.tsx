import { ActionIcon, Drawer, Group } from "@mantine/core";
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconMaximize,
  IconMenu,
  IconMinimize,
  IconSwitchVertical,
} from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { mobileSmallBoardAtom } from "@/state/mobileAtoms";
import { keyMapAtom } from "@/state/keybinds";
import { usePressHold } from "@/utils/pressHold";
import { TreeStateContext } from "../common/TreeStateContext";
import classes from "./MobileAnalysisBar.module.css";
import { MobileAnalysisMenu } from "./MobileAnalysisMenu";

interface MobileAnalysisBarProps {
  editingMode: boolean;
  toggleEditingMode: () => void;
  dirty: boolean;
  saveFile: () => void;
}

/**
 * The phone action bar for the Analysis screen, laid out like the reference
 * app's: menu, flip, board size, then the two move steppers with
 * press-and-hold repeat at the end. The engine toggle lives in the menu's
 * display row instead of the bar — arrows and engine are both "what the
 * evaluation shows", and the bar stays five wide taps.
 */
export function MobileAnalysisBar({
  editingMode,
  toggleEditingMode,
  dirty,
  saveFile,
}: MobileAnalysisBarProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const store = useContext(TreeStateContext)!;
  const headers = useStore(store, (s) => s.headers);
  const root = useStore(store, (s) => s.root);
  const setHeaders = useStore(store, (s) => s.setHeaders);
  const previous = useStore(store, (s) => s.goToPrevious);
  const next = useStore(store, (s) => s.goToNext);

  const [smallBoard, setSmallBoard] = useAtom(mobileSmallBoardAtom);
  const keyMap = useAtomValue(keyMapAtom);

  // Real disabled states for the steppers, mirroring the store's own guards:
  // back only when off the root, forward only when a child move exists. The
  // press-hold repeat stops itself when it walks into either edge.
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

  const orientation = headers.orientation || "white";
  const toggleOrientation = () =>
    setHeaders({
      ...headers,
      fen: root.fen,
      orientation: orientation === "black" ? "white" : "black",
    });

  const SizeIcon = smallBoard ? IconMaximize : IconMinimize;

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
        <ActionIcon
          className={classes.button}
          variant="transparent"
          onClick={toggleOrientation}
          aria-label={t("Board.Action.FlipBoard", { key: keyMap.SWAP_ORIENTATION.keys })}
        >
          <IconSwitchVertical size="1.35rem" />
        </ActionIcon>
        <ActionIcon
          className={classes.button}
          variant="transparent"
          onClick={() => setSmallBoard(!smallBoard)}
          aria-label={t(smallBoard ? "Board.Mobile.ExpandBoard" : "Board.Mobile.CollapseBoard")}
          aria-pressed={smallBoard}
        >
          <SizeIcon size="1.35rem" />
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

      <Drawer
        opened={menuOpen}
        onClose={() => setMenuOpen(false)}
        position="bottom"
        withCloseButton
      >
        <MobileAnalysisMenu
          editingMode={editingMode}
          toggleEditingMode={toggleEditingMode}
          dirty={dirty}
          saveFile={saveFile}
          onClose={() => setMenuOpen(false)}
        />
      </Drawer>
    </>
  );
}
