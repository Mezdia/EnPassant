import { resolve } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { exists, readFile, writeFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { isMobile } from "@/utils/platform";

/**
 * Copying PGNs into the app's own documents directory.
 *
 * Android has no free-form filesystem for an app to browse: files arrive through
 * the Storage Access Framework picker, which hands back either a content URI or
 * (with the dialog plugin's default `copy` access mode) a path inside the app
 * sandbox. Either way the only durable home for the file is our documents dir,
 * so importing means copy — not "remember this path".
 */

export type ImportResult = {
    /** Absolute paths of the copies inside the destination directory. */
    imported: string[];
    /** Sources that could not be read or written. */
    failed: string[];
};

/**
 * Best-effort file name for an imported source.
 *
 * Handles plain paths (`/home/me/games.pgn`, `C:\games\me.pgn`) and the content
 * URIs Android's picker returns (`content://…/document/primary%3ADocs%2Fme.pgn`,
 * `content://…/document/msf%3A42`).
 */
export function importedFileName(source: string): string {
    const withoutQuery = source.split(/[?#]/)[0];
    let decoded = withoutQuery;
    try {
        decoded = decodeURIComponent(withoutQuery);
    } catch {
        // Stray `%` in a real file name: keep the raw string.
    }
    const segment =
        decoded
            .split(/[/\\:]/)
            .filter((part) => part.length > 0)
            .pop() ?? "";
    const sanitized = segment
        .replace(/[^\w\-. ()[\]]+/g, "_")
        .replace(/^[.\s]+/, "")
        .trim();
    if (sanitized.length === 0) {
        return "imported.pgn";
    }
    return /\.pgn$/i.test(sanitized) ? sanitized : `${sanitized}.pgn`;
}

/** First free `name.pgn` / `name (2).pgn` / … in `dir`. */
async function uniqueDestination(dir: string, fileName: string): Promise<string> {
    const base = fileName.replace(/\.pgn$/i, "");
    for (let attempt = 1; attempt <= 100; attempt++) {
        const candidate = await resolve(
            dir,
            attempt === 1 ? `${base}.pgn` : `${base} (${attempt}).pgn`,
        );
        if (!(await exists(candidate))) {
            return candidate;
        }
    }
    return resolve(dir, `${base}-${Date.now()}.pgn`);
}

/**
 * Prompts for PGN files and copies them into `destDir`.
 *
 * Returns empty lists when the picker is dismissed.
 */
export async function importPgnFiles(destDir: string): Promise<ImportResult> {
    const selected = await open({
        multiple: true,
        // Android resolves extension filters to MIME types and has none for
        // `.pgn`, which would hide every file in the picker — so filter on
        // desktop only and just ask for the document picker on mobile.
        filters: isMobile() ? undefined : [{ name: "PGN file", extensions: ["pgn"] }],
        pickerMode: "document",
    });
    const sources = selected === null ? [] : Array.isArray(selected) ? selected : [selected];

    const result: ImportResult = { imported: [], failed: [] };
    for (const source of sources) {
        try {
            const bytes = await readFile(source);
            const destination = await uniqueDestination(destDir, importedFileName(source));
            await writeFile(destination, bytes);
            // Sidecar metadata, so the file lands in the Files list as a game
            // rather than the "other" default.
            await writeTextFile(
                destination.replace(/\.pgn$/i, ".info"),
                JSON.stringify({ type: "game", tags: [] }),
            );
            result.imported.push(destination);
        } catch {
            result.failed.push(source);
        }
    }
    return result;
}
