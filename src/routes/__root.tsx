import { AppShell } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  createRootRouteWithContext,
  Outlet,
  useMatchRoute,
  useNavigate,
} from "@tanstack/react-router";
import { TauriEvent } from "@tauri-apps/api/event";
import { Menu, MenuItem, PredefinedMenuItem, Submenu } from "@tauri-apps/api/menu";
import { appLogDir, resolve } from "@tauri-apps/api/path";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ask, message, open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import { exit, relaunch } from "@tauri-apps/plugin-process";
import { openPath, openUrl } from "@tauri-apps/plugin-opener";
import { check } from "@tauri-apps/plugin-updater";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import useSWRImmutable from "swr/immutable";
import { match } from "ts-pattern";
import type { Dirs } from "@/App";
import AboutModal from "@/components/About";
import { BottomTabBar } from "@/components/BottomTabBar";
import { SideBar } from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { activeTabAtom, currentTabAtom, nativeBarAtom, tabsAtom } from "@/state/atoms";
import { keyMapAtom } from "@/state/keybinds";
import { APP_DOCS_URL } from "@/utils/branding";
import { openFile } from "@/utils/files";
import { isDesktop } from "@/utils/platform";
import { createTab } from "@/utils/tabs";

type MenuGroup = {
  label: string;
  options: MenuAction[];
};

type MenuAction = {
  id?: string;
  label: string;
  shortcut?: string;
  action?: () => void;
  item?: "Hide" | "Copy" | "Cut" | "Paste" | "SelectAll" | "Undo" | "Redo" | "Quit";
};

async function createMenu(menuActions: MenuGroup[]) {
  const items = await Promise.all(
    menuActions.map(async (group) => {
      const submenuItems = await Promise.all(
        group.options.map(async (option) => {
          return match(option.label)
            .with("divider", () =>
              PredefinedMenuItem.new({
                item: "Separator",
              }),
            )
            .otherwise(() => {
              if (option.item) {
                return PredefinedMenuItem.new({
                  text: option.label,
                  item: option.item,
                });
              }

              return MenuItem.new({
                id: option.id,
                text: option.label,
                accelerator: option.shortcut,
                action: option.action,
              });
            });
        }),
      );

      return Submenu.new({
        text: group.label,
        items: submenuItems,
      });
    }),
  );

  return Menu.new({
    items: items,
  });
}

export const Route = createRootRouteWithContext<{
  loadDirs: () => Promise<Dirs>;
}>()({
  component: RootLayout,
});

function RootLayout() {
  const isNative = useAtomValue(nativeBarAtom);
  const navigate = useNavigate();

  const [, setTabs] = useAtom(tabsAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const currentTab = useAtomValue(currentTabAtom);

  const { t } = useTranslation();

  const openNewFile = useCallback(async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "PGN file", extensions: ["pgn"] }],
    });
    if (typeof selected === "string") {
      navigate({ to: "/" });
      openFile(selected, setTabs, setActiveTab);
    }
  }, [navigate, setActiveTab, setTabs]);

  const createNewTab = useCallback(() => {
    navigate({ to: "/" });
    createTab({
      tab: { name: t("Tab.NewTab"), type: "new" },
      setTabs,
      setActiveTab,
    });
  }, [navigate, setActiveTab, setTabs, t]);

  const checkForUpdates = useCallback(async () => {
    const update = await check();
    if (update) {
      const yes = await ask("Do you want to install the new version now?", {
        title: "New version available",
      });
      if (yes) {
        await update.downloadAndInstall();
        await relaunch();
      }
    } else {
      await message("No updates available");
    }
  }, []);

  const openSettings = useCallback(async () => {
    navigate({ to: "/settings" });
  }, [navigate]);

  const toggleFullscreen = useCallback(async () => {
    const currentWindow = getCurrentWindow();
    const isFullscreen = await currentWindow.isFullscreen();
    await currentWindow.setFullscreen(!isFullscreen);
  }, []);

  const [keyMap] = useAtom(keyMapAtom);

  useHotkeys(keyMap.NEW_TAB.keys, createNewTab);
  useHotkeys(keyMap.OPEN_FILE.keys, openNewFile);
  const [opened, setOpened] = useState(false);

  const isMacOS = platform() === "macos";
  const mobile = !isDesktop();

  // Analysis, Puzzle and Play own the whole phone viewport: each one closes the
  // screen with its own action bar (the analysis bar, the puzzle bar, the game
  // bar), and a second bar underneath only steals a row of height from the
  // board. Every other screen keeps the tab bar.
  const matchRoute = useMatchRoute();
  const immersiveTab =
    matchRoute({ to: "/" }) !== false &&
    (currentTab?.type === "analysis" ||
      currentTab?.type === "puzzles" ||
      currentTab?.type === "play");

  const aboutOption = {
    label: t("Menu.Help.About"),
    id: "about",
    action: () => setOpened(true),
  };

  const checkForUpdatesOption = {
    label: t("Menu.Help.CheckUpdate"),
    id: "check_for_updates",
    action: checkForUpdates,
  };

  const appMenu: MenuGroup = {
    label: "Application Menu",
    options: [
      {
        label: t("Menu.Application.About", {
          defaultValue: t("Menu.Help.About"),
        }),
        id: aboutOption.id,
        action: aboutOption.action,
      },
      checkForUpdatesOption,
      { label: "divider" },
      {
        label: t("SideBar.Settings") + "...",
        id: "settings",
        shortcut: "cmd+,",
        action: openSettings,
      },
      {
        label: t("Menu.Application.Hide"),
        item: "Hide",
      },
      { label: "divider" },
      {
        label: t("Menu.Application.Quit", {
          defaultValue: t("Menu.File.Exit"),
        }),
        item: "Quit",
      },
    ],
  };

  const macOSEditMenu: MenuGroup = {
    label: t("Menu.Edit"),
    options: [
      {
        label: t("Menu.Edit.Undo"),
        item: "Undo",
      },
      {
        label: t("Menu.Edit.Redo"),
        item: "Redo",
      },
      { label: "divider" },
      {
        label: t("Menu.Edit.Copy"),
        item: "Copy",
      },
      {
        label: t("Menu.Edit.Cut"),
        item: "Cut",
      },
      {
        label: t("Menu.Edit.Paste"),
        item: "Paste",
      },
      { label: "divider" },
      {
        label: t("Menu.Edit.SelectAll"),
        item: "SelectAll",
      },
    ],
  };

  const menuActions: MenuGroup[] = useMemo(
    () => [
      ...(isMacOS ? [appMenu] : []),
      {
        label: t("Menu.File"),
        options: [
          {
            label: t("Menu.File.NewTab"),
            id: "new_tab",
            shortcut: keyMap.NEW_TAB.keys,
            action: createNewTab,
          },
          {
            label: t("Menu.File.OpenFile"),
            id: "open_file",
            shortcut: keyMap.OPEN_FILE.keys,
            action: openNewFile,
          },
          ...(!isMacOS
            ? [
                {
                  label: t("Menu.File.Exit"),
                  id: "exit",
                  action: () => exit(0),
                },
              ]
            : []),
        ],
      },
      ...(!isMacOS ? [] : [macOSEditMenu]),
      {
        label: t("Menu.View"),
        options: [
          {
            label: t("Menu.View.Reload"),
            id: "reload",
            shortcut: "Ctrl+R",
            action: () => location.reload(),
          },
          {
            label: t("Menu.View.Fullscreen", {
              defaultValue: "Toggle Fullscreen",
            }),
            id: "toggle_fullscreen",
            shortcut: isMacOS ? "Ctrl+Cmd+F" : "F11",
            action: toggleFullscreen,
          },
        ],
      },
      {
        label: t("Menu.Help"),
        options: [
          {
            label: t("Menu.Help.Documentation"),
            id: "documentation",
            action: () => openUrl(APP_DOCS_URL),
          },
          {
            label: t("Menu.Help.ClearSavedData"),
            id: "clear_saved_data",
            action: () => {
              ask("Are you sure you want to clear all saved data?", {
                title: "Clear data",
              }).then((res) => {
                if (res) {
                  localStorage.clear();
                  sessionStorage.clear();
                  location.reload();
                }
              });
            },
          },
          {
            label: t("Menu.Help.OpenLogs"),
            id: "logs",
            action: async () => {
              const path = await resolve(await appLogDir(), "en-passant.log");
              notifications.show({
                title: "Logs",
                message: `Opened logs in ${path}`,
              });
              await openPath(path);
            },
          },
          { label: "divider" },
          ...(!isMacOS ? [checkForUpdatesOption, aboutOption] : []),
        ],
      },
    ],
    [t, checkForUpdates, createNewTab, keyMap, openNewFile, toggleFullscreen],
  );

  const { data: menu } = useSWRImmutable(isDesktop() ? ["menu", menuActions] : null, () =>
    createMenu(menuActions),
  );

  useEffect(() => {
    if (!menu) return;
    // Native menus & window decorations are desktop-only APIs; skip on mobile.
    if (!isDesktop()) return;
    if (
      isNative ||
      (import.meta.env.VITE_PLATFORM !== "win32" && import.meta.env.VITE_PLATFORM !== "linux")
    ) {
      menu.setAsAppMenu();
      getCurrentWindow().setDecorations(true);
    } else {
      Menu.new().then((m) => m.setAsAppMenu());
      getCurrentWindow().setDecorations(false);
    }
  }, [menu, isNative]);

  useEffect(() => {
    // File drag-drop is a desktop window event; N/A on touch devices.
    if (!isDesktop()) return;
    const unlisten = getCurrentWindow().listen(TauriEvent.DRAG_DROP, (event) => {
      const payload = event.payload as { paths: string[] };
      if (payload?.paths) {
        const pgnFiles = payload.paths.filter((path) => path.toLowerCase().endsWith(".pgn"));

        if (pgnFiles.length > 0) {
          navigate({ to: "/" });
          for (const file of pgnFiles) {
            openFile(file, setTabs, setActiveTab);
          }
        }
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [navigate, setTabs, setActiveTab]);

  if (mobile) {
    // Android 15+ forces edge-to-edge on apps targeting 35, so the WebView draws
    // under the status and gesture bars and the insets have to be applied here
    // or the top of the app hides behind the status icons.
    //
    // The height subtracts the footer instead of letting AppShell pad for it:
    // Chrome leaves a scroll container's own bottom padding out of scrollHeight,
    // so that padding never clears the fixed tab bar and the last block on a
    // page (Home's Recent Files, for one) ended up underneath it.
    return (
      <AppShell
        footer={
          immersiveTab ? undefined : { height: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }
        }
        styles={{
          main: {
            // An immersive screen ends at the gesture bar: its own bottom bar
            // already carries the safe-area inset.
            height: immersiveTab
              ? "100dvh"
              : "calc(100dvh - 3.5rem - env(safe-area-inset-bottom, 0px))",
            // AppShell.Main ships its own min-height: 100dvh, which would
            // otherwise override the height above and keep the content running
            // under the fixed tab bar.
            minHeight: 0,
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: 0,
            overflowY: "auto",
            userSelect: "none",
          },
        }}
      >
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        {!immersiveTab && (
          <AppShell.Footer>
            <BottomTabBar />
          </AppShell.Footer>
        )}
      </AppShell>
    );
  }

  return (
    <AppShell
      navbar={{
        width: "3rem",
        breakpoint: 0,
      }}
      header={
        isNative ||
        (import.meta.env.VITE_PLATFORM !== "win32" && import.meta.env.VITE_PLATFORM !== "linux")
          ? undefined
          : {
              height: "2.25rem",
            }
      }
      styles={{
        main: {
          height: "100vh",
          userSelect: "none",
        },
      }}
    >
      <AboutModal opened={opened} setOpened={setOpened} />
      {!isNative &&
        (import.meta.env.VITE_PLATFORM === "win32" ||
          import.meta.env.VITE_PLATFORM === "linux") && (
          <AppShell.Header>
            <TopBar menuActions={menuActions} />
          </AppShell.Header>
        )}
      <AppShell.Navbar>
        <SideBar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
