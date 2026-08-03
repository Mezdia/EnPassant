import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChess,
  IconDatabase,
  IconLayoutGrid,
  IconPlus,
  IconPuzzle,
  IconX,
  IconZoomCheck,
} from "@tabler/icons-react";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import type { Tab } from "@/utils/tabs";
import { FileIcon } from "../files/FileIcon";
import classes from "./BoardSwitcher.module.css";

function TabIcon({ tab }: { tab: Tab }) {
  if (tab.type === "puzzles") return <IconPuzzle size="1rem" />;
  if (tab.type === "play") return <IconChess size="1rem" />;
  if (tab.gameOrigin.kind === "database") return <IconDatabase size="1rem" />;
  if (tab.gameOrigin.kind === "file" || tab.gameOrigin.kind === "temp_file") {
    return <FileIcon type={tab.gameOrigin.file.metadata.type} size="1rem" />;
  }
  if (tab.type === "analysis") return <IconZoomCheck size="1rem" />;
  return <IconChess size="1rem" />;
}

/**
 * Mobile replacement for the desktop browser-style tab bar. One board fills the
 * screen; this bar shows the active board's name and opens a drawer to switch
 * between, close, or create boards.
 */
export function BoardSwitcher({
  tabs,
  activeTab,
  setActiveTab,
  closeTab,
  createNewTab,
}: {
  tabs: Tab[];
  activeTab: string | null;
  setActiveTab: (v: string) => void;
  closeTab: (v: string | null) => void;
  createNewTab: () => void;
}) {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  const active = tabs.find((tab) => tab.value === activeTab);
  const activeName = active ? t(active.name, { defaultValue: active.name }) : t("Tab.NewTab");

  return (
    <>
      <Group className={classes.bar} gap="xs" wrap="nowrap" px="xs">
        <ActionIcon
          variant="subtle"
          onClick={open}
          aria-label={t("Tab.SwitchBoard", { defaultValue: "Switch board" })}
        >
          <IconLayoutGrid size="1.25rem" />
        </ActionIcon>
        <Group gap={6} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          {active && <TabIcon tab={active} />}
          <Text size="sm" truncate fw={500}>
            {activeName}
          </Text>
        </Group>
        <ActionIcon variant="subtle" onClick={createNewTab} aria-label={t("Tab.NewTab")}>
          <IconPlus size="1.25rem" />
        </ActionIcon>
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        size="80%"
        title={t("Tab.OpenBoards", { defaultValue: "Open boards" })}
      >
        <Stack gap="xs">
          <ScrollArea.Autosize mah="70vh">
            <Stack gap={4}>
              {tabs.map((tab) => (
                <Group key={tab.value} gap={0} wrap="nowrap">
                  <UnstyledButton
                    className={cx(classes.item, {
                      [classes.selected]: tab.value === activeTab,
                    })}
                    onClick={() => {
                      setActiveTab(tab.value);
                      close();
                    }}
                  >
                    <Group gap={8} wrap="nowrap">
                      <TabIcon tab={tab} />
                      <Text size="sm" truncate>
                        {t(tab.name, { defaultValue: tab.name })}
                      </Text>
                    </Group>
                  </UnstyledButton>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label={t("Tab.CloseTab", { defaultValue: "Close tab" })}
                    onClick={() => closeTab(tab.value)}
                  >
                    <IconX size="1rem" />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </ScrollArea.Autosize>
          <Button
            leftSection={<IconPlus size="1rem" />}
            variant="light"
            onClick={() => {
              createNewTab();
              close();
            }}
          >
            {t("Tab.NewTab")}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
