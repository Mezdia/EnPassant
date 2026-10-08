import { ActionIcon, Button, Drawer, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconChess,
  IconDatabase,
  IconLayoutGrid,
  IconPlus,
  IconPuzzle,
  IconX,
  IconZoomCheck,
} from "@tabler/icons-react";
import cx from "clsx";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import type { Tab } from "@/utils/tabs";
import { FileIcon } from "../files/FileIcon";
import classes from "./BoardSwitcher.module.css";

/**
 * A single line of text that pans sideways when it does not fit, so a long
 * board name stays fully readable without the row growing and pushing the
 * close button out of the drawer.
 */
function MarqueeText({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    // Measure the clipping box, not the inner span: while it is still inline it
    // has no layout box of its own, so its scrollWidth reports no overflow and
    // the pan would never start.
    const measure = () => setDistance(Math.max(0, outer.scrollWidth - outer.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [children]);

  const overflowing = distance > 0;

  return (
    <span ref={outerRef} className={classes.marquee}>
      <span
        ref={innerRef}
        className={overflowing ? classes.marqueeRun : undefined}
        style={
          overflowing
            ? ({
                "--marquee": `${distance}px`,
                animationDuration: `${Math.max(4, distance / 22)}s`,
              } as CSSProperties)
            : undefined
        }
      >
        {children}
      </span>
    </span>
  );
}

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
        // The drawer slides out leftwards when dismissed, so the affordance
        // points the same way instead of using the generic cross. CloseButton
        // takes the glyph through `icon` — `children` renders alongside the
        // default cross rather than replacing it.
        closeButtonProps={{ icon: <IconArrowLeft size="1rem" /> }}
      >
        <Stack gap="xs">
          {/* A plain scroll box, not ScrollArea: Mantine gives the ScrollArea
              content `min-width: fit-content`, so a long board name widened the
              whole row and pushed the close button past the drawer's right
              edge instead of letting the label shrink. */}
          <div className={classes.list}>
            <Stack gap={4}>
              {tabs.map((tab) => (
                <div
                  key={tab.value}
                  className={cx(classes.row, {
                    [classes.selected]: tab.value === activeTab,
                  })}
                >
                  <UnstyledButton
                    className={classes.item}
                    onClick={() => {
                      setActiveTab(tab.value);
                      close();
                    }}
                  >
                    <span className={classes.itemRow}>
                      <TabIcon tab={tab} />
                      <MarqueeText>{t(tab.name, { defaultValue: tab.name })}</MarqueeText>
                    </span>
                  </UnstyledButton>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label={t("Tab.CloseTab", { defaultValue: "Close tab" })}
                    onClick={() => closeTab(tab.value)}
                  >
                    <IconX size="1rem" />
                  </ActionIcon>
                </div>
              ))}
            </Stack>
          </div>
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
