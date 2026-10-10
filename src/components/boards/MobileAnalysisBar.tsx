import { ActionIcon, Drawer, Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMenu,
  IconSwitchVertical,
  IconZoomCheck,
} from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { allEnabledAtom, enableAllAtom } from "@/state/atoms";
import { keyMapAtom } from "@/state/keybinds";
import { TreeStateContext } from "../common/TreeStateContext";
import BoardControls from "./BoardControls";
import classes from "./MobileAnalysisBar.module.css";

interface MobileAnalysisBarProps {
  editingMode: boolean;
  toggleEditingMode: () => void;
  dirty: boolean;
  saveFile: () => void;
}

/**
 * The phone action bar for the Analysis screen, laid out like the reference
 * app's: menu, flip, engine, then the two move steppers at the end. The actions
 * that used to live in the notation column's side strip go behind the menu, in a
 * bottom sheet, which is this design system's equivalent of an action sheet.
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

  const allEnabled = useAtomValue(allEnabledAtom);
  const [, enable] = useAtom(enableAllAtom);
  const keyMap = useAtomValue(keyMapAtom);

  const orientation = headers.orientation || "white";
  const toggleOrientation = () =>
    setHeaders({
      ...headers,
      fen: root.fen,
      orientation: orientation === "black" ? "white" : "black",
    });

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
          variant={allEnabled ? "filled" : "transparent"}
          onClick={() => enable(!allEnabled)}
          aria-label={t("Board.Mobile.Engine")}
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
            dirty={dirty}
            saveFile={saveFile}
          />
        </div>
      </Drawer>
    </>
  );
}
