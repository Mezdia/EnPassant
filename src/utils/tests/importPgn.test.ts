import { expect, test } from "vitest";
import { importedFileName } from "../importPgn";

test("derives a file name from a plain path", () => {
    expect(importedFileName("/home/me/Games/opening notes.pgn")).toBe("opening notes.pgn");
    expect(importedFileName("C:\\Users\\me\\game.PGN")).toBe("game.PGN");
});

test("derives a file name from an Android content URI", () => {
    expect(
        importedFileName(
            "content://com.android.externalstorage.documents/document/primary%3ADocuments%2Fmy%20game.pgn",
        ),
    ).toBe("my game.pgn");
});

test("falls back to a .pgn name when the URI carries no file name", () => {
    expect(
        importedFileName("content://com.android.providers.downloads.documents/document/msf%3A42"),
    ).toBe("42.pgn");
    expect(importedFileName("")).toBe("imported.pgn");
    expect(importedFileName("content://provider/document/...")).toBe("imported.pgn");
});

test("keeps a stray percent sign out of the file name", () => {
    // decodeURIComponent throws on "%.p", so the raw segment is sanitised instead.
    expect(importedFileName("/storage/emulated/0/Download/50%.pgn")).toBe("50_.pgn");
});

test("ignores query and fragment parts", () => {
    expect(importedFileName("https://example.org/games/tata.pgn?raw=1#top")).toBe("tata.pgn");
});
