import { atomWithStorage } from "jotai/utils";

/**
 * Fork-only local bookmarks for the phone UI. The reference app's bookmark
 * feature persists an analysis game; there is no server endpoint in this app,
 * so the bookmark is stored locally (localStorage / Tauri webview storage)
 * and its payload is the PGN captured at save time. No protocol, no network.
 */
export interface MobileBookmark {
    id: string;
    name: string;
    pgn: string;
    createdAt: number;
}

export const mobileBookmarksAtom = atomWithStorage<MobileBookmark[]>(
    "mobile-bookmarks",
    [],
    undefined,
    { getOnInit: true },
);

export function createBookmark(name: string, pgn: string): MobileBookmark {
    return {
        // crypto.randomUUID exists in every Tauri webview and browser we target.
        id: crypto.randomUUID(),
        name,
        pgn,
        createdAt: Date.now(),
    };
}
