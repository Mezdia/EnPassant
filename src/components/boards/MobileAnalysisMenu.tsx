import { ActionIcon, Button, Divider, Group, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconArrowBackUp, IconCopy, IconRoute, IconTargetArrow } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useContext, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { showArrowsAtom, showConsecutiveArrowsAtom, showVariationArrowsAtom } from "@/state/atoms";
import { TreeStateContext } from "../common/TreeStateContext";
import BoardControls from "./BoardControls";
import { MobileBookmarkSection } from "./MobileBookmarkSection";
import classes from "./MobileAnalysisMenu.module.css";

interface MobileAnalysisMenuProps {
  editingMode: boolean;
  toggleEditingMode: () => void;
  dirty: boolean;
  saveFile: () => void;
  onClose: () => void;
}

/**
 * The phone bottom-sheet content for the Analysis screen. The upstream
 * `BoardControls` strip is reused as one row (its desktop column layout is
 * flipped to a row purely via CSS, same override as before); on top of it the
 * sheet now groups the two MVP gaps: a single display-toggle row (mirroring
 * the reference app's view settings) and a clipboard PGN export that works
 * without the desktop-only save dialog.
 */
export function MobileAnalysisMenu({
  editingMode,
  toggleEditingMode,
  dirty,
  saveFile,
  onClose,
}: MobileAnalysisMenuProps) {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext)!;

  const [showArrows, setShowArrows] = useAtom(showArrowsAtom);
  const [showVariationArrows, setShowVariationArrows] = useAtom(showVariationArrowsAtom);
  const [showConsecutiveArrows, setShowConsecutiveArrows] = useAtom(showConsecutiveArrowsAtom);

  const copyPgn = () => {
    // Reuses the tree store's own serializer — the same PGN the desktop
    // context menu copies, so mobile never drifts from upstream format.
    store.getState().copyPgn();
    showNotification({ message: t("Board.Mobile.PgnCopied"), autoClose: 3000 });
    onClose();
  };

  return (
    <Stack gap="sm" className={classes.sheet}>
      <div>
        <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
          {t("Board.Mobile.Display")}
        </Text>
        <Group gap="xs" wrap="nowrap" mt="xs" justify="space-between">
          <ToggleCell
            label={t("Board.Mobile.BestArrows")}
            pressed={showArrows}
            onClick={() => setShowArrows(!showArrows)}
          >
            <IconTargetArrow size="1.2rem" />
          </ToggleCell>
          <ToggleCell
            label={t("Board.Mobile.VariationArrows")}
            pressed={showVariationArrows}
            onClick={() => setShowVariationArrows(!showVariationArrows)}
          >
            <IconRoute size="1.2rem" />
          </ToggleCell>
          <ToggleCell
            label={t("Board.Mobile.ConsecutiveArrows")}
            pressed={showConsecutiveArrows}
            onClick={() => setShowConsecutiveArrows(!showConsecutiveArrows)}
          >
            <IconArrowBackUp size="1.2rem" />
          </ToggleCell>
        </Group>
      </div>

      <Divider />

      {/* BoardControls renders a vertical Stack for the desktop notation
          strip; in this sheet it reads as a horizontal action row. */}
      <div className={classes.controls}>
        <BoardControls
          editingMode={editingMode}
          toggleEditingMode={toggleEditingMode}
          dirty={dirty}
          saveFile={saveFile}
        />
      </div>

      {/* MobileBookmarkSection brings its own leading Divider */}
      <MobileBookmarkSection />

      <Divider />

      <Button
        variant="default"
        size="md"
        leftSection={<IconCopy size="1.1rem" />}
        onClick={copyPgn}
        aria-label={t("Board.Mobile.CopyPgn")}
      >
        {t("Board.Mobile.CopyPgn")}
      </Button>
    </Stack>
  );
}

function ToggleCell({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Stack align="center" gap={4} className={classes.toggleCell}>
      <ActionIcon
        size="lg"
        variant={pressed ? "filled" : "default"}
        color="gray"
        onClick={onClick}
        aria-label={label}
        aria-pressed={pressed}
      >
        {children}
      </ActionIcon>
      <Text fz="10px" c="dimmed" ta="center" className={classes.toggleLabel}>
        {label}
      </Text>
    </Stack>
  );
}

export default MobileAnalysisMenu;
