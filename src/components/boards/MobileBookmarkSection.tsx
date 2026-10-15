import { ActionIcon, Divider, Group, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconBookmark, IconBookmarkOff, IconCopy, IconTrash } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { createBookmark, mobileBookmarksAtom } from "@/state/mobileBookmarks";
import { getPGN } from "@/utils/chess";
import { getGameName } from "@/utils/treeReducer";
import { TreeStateContext } from "../common/TreeStateContext";

/**
 * Local bookmarks for the phone analysis menu (D5, owner-authorized).
 * The reference app persists bookmarks server-side; this app has no such
 * endpoint, so a bookmark is a locally stored PGN snapshot (atomWithStorage)
 * with copy/remove — UI-only, no protocol invented. Rendered inside the
 * existing bottom sheet, not a new region.
 */
export function MobileBookmarkSection() {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext)!;
  const root = useStore(store, (s) => s.root);
  const headers = useStore(store, (s) => s.headers);
  const [bookmarks, setBookmarks] = useAtom(mobileBookmarksAtom);

  // Computed per render; the sheet body only mounts while the Drawer is open,
  // and the store slices above are the same immutable refs getPGN reads in
  // utils/tabs.ts — the bookmark is exactly the PGN a save would produce.
  const pgn = `${getPGN(root, {
    headers,
    comments: true,
    extraMarkups: true,
    glyphs: true,
    variations: true,
  })}\n\n`;

  const isSaved = bookmarks.some((b) => b.pgn === pgn);

  const toggle = () => {
    if (isSaved) {
      setBookmarks(bookmarks.filter((b) => b.pgn !== pgn));
      showNotification({ message: t("Board.Mobile.BookmarkRemoved"), autoClose: 3000 });
      return;
    }
    const name = getGameName(headers) || t("Board.Mobile.Bookmarks");
    setBookmarks([createBookmark(name, pgn), ...bookmarks]);
    showNotification({ message: t("Board.Mobile.BookmarkSaved"), autoClose: 3000 });
  };

  return (
    <>
      <Divider />

      <ActionIcon
        size="lg"
        variant={isSaved ? "filled" : "default"}
        color="yellow"
        onClick={toggle}
        aria-label={isSaved ? t("Board.Mobile.RemoveBookmark") : t("Board.Mobile.Bookmark")}
        aria-pressed={isSaved}
      >
        {isSaved ? <IconBookmarkOff size="1.2rem" /> : <IconBookmark size="1.2rem" />}
      </ActionIcon>

      <Text fz="xs" c="dimmed" tt="uppercase" fw={700} mt="xs">
        {t("Board.Mobile.Bookmarks")}
      </Text>

      {bookmarks.length === 0 ? (
        <Text fz="xs" c="dimmed">
          {t("Board.Mobile.NoBookmarks")}
        </Text>
      ) : (
        <Stack gap={4}>
          {bookmarks.slice(0, 10).map((b) => (
            <Group key={b.id} gap="xs" wrap="nowrap">
              <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                <Text fz="sm" truncate>
                  {b.name}
                </Text>
                <Text fz="xs" c="dimmed">
                  {new Date(b.createdAt).toLocaleDateString()}
                </Text>
              </Stack>
              <ActionIcon
                variant="subtle"
                aria-label={t("Board.Mobile.CopyPgn")}
                onClick={() => {
                  navigator.clipboard.writeText(b.pgn);
                  showNotification({
                    message: t("Board.Mobile.PgnCopied"),
                    autoClose: 3000,
                  });
                }}
              >
                <IconCopy size="1.1rem" />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={t("Board.Mobile.RemoveBookmark")}
                onClick={() => setBookmarks(bookmarks.filter((x) => x.id !== b.id))}
              >
                <IconTrash size="1.1rem" />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </>
  );
}

export default MobileBookmarkSection;
