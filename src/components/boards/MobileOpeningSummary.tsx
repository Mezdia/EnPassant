import { Box, Group, Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { TreeStateContext } from "../common/TreeStateContext";
import OpeningName from "../common/OpeningName";

/**
 * Mobile-only summary header shown above the database (opening explorer) tab:
 * the opening the explorer is currently querying plus the ply count, so a
 * scrolled table never loses its position context on a phone. Desktop does
 * not render this (gated where it is mounted, one switch point).
 */
export function MobileOpeningSummary() {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext)!;
  const ply = useStore(store, (s) => s.position.length);

  return (
    <Paper withBorder px="sm" py={4} style={{ flex: "none" }}>
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Box style={{ flex: 1, minWidth: 0 }}>
          <OpeningName />
        </Box>
        <Text fz="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
          {t("Board.Mobile.PlyCount", { moves: ply })}
        </Text>
      </Group>
    </Paper>
  );
}

export default MobileOpeningSummary;
