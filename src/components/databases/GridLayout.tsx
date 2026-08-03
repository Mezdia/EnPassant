import { ActionIcon, Box, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import classes from "./GridLayout.module.css";

/**
 * The frame the three database tabs share: list on the left, preview on the
 * right.
 *
 * Desktop and mobile landscape keep both columns. Portrait has room for only
 * one, so the same panes become a drill-in — the list until a row is selected,
 * then the preview with a back affordance. Callers pass `selected`/`onBack` to
 * opt into that; without them portrait just shows the list.
 */
function GridLayout({
  search,
  table,
  preview,
  selected,
  onBack,
}: {
  search: ReactNode;
  table: ReactNode;
  preview: ReactNode;
  /** Portrait only: true once a row is picked, which swaps the list for the preview. */
  selected?: boolean;
  /** Portrait only: clears the selection to go back to the list. */
  onBack?: () => void;
}) {
  const { t } = useTranslation();
  const portrait = useIsMobilePortrait();

  if (portrait) {
    if (selected && onBack) {
      return (
        <Box style={{ display: "flex", flexDirection: "column", gap: "0.5rem", height: "100%" }}>
          <Group gap="xs">
            <ActionIcon variant="default" onClick={onBack} aria-label={t("Common.Back")}>
              <IconArrowLeft size="1rem" />
            </ActionIcon>
          </Group>
          <Box style={{ flex: 1, overflow: "hidden" }}>{preview}</Box>
        </Box>
      );
    }

    return (
      <Box
        style={{
          display: "flex",
          gap: "0.5rem",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {search}
        <Box style={{ flex: 1, overflow: "hidden" }}>{table}</Box>
      </Box>
    );
  }

  return (
    <Group grow h="100%">
      <Box
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box className={classes.search}>{search}</Box>
        {table}
      </Box>

      <Box
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {preview}
      </Box>
    </Group>
  );
}

export default GridLayout;
