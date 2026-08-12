import { appDataDir, documentDir, homeDir, resolve } from "@tauri-apps/api/path";
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import { APP_SLUG } from "@/utils/branding";
import { isMobile } from "@/utils/platform";

function getStoredDirectory(key: string): string | null {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
        const parsed = JSON.parse(stored);
        return typeof parsed === "string" && parsed.length > 0 ? parsed : null;
    } catch {
        return null;
    }
}

async function ensureDirectory(path: string): Promise<string> {
    if (!(await exists(path))) {
        await mkdir(path, { recursive: true });
    }
    return path;
}

/**
 * Like {@link ensureDirectory} but gives up instead of throwing.
 *
 * A stored path can become unusable — an unplugged drive on desktop, or a path
 * carried over from a desktop install into app-private storage on mobile — and a
 * throw here would take the whole route loader down.
 */
async function tryEnsureDirectory(path: string): Promise<string | null> {
    try {
        return await ensureDirectory(path);
    } catch {
        return null;
    }
}

/** Root of the app's own storage; the only writable place on Android. */
async function appScopedDir(name: string): Promise<string> {
    return ensureDirectory(await resolve(await appDataDir(), name));
}

export async function getDatabasesDir(): Promise<string> {
    const customDir = getStoredDirectory("databases-dir");
    if (customDir) {
        const dir = await tryEnsureDirectory(customDir);
        if (dir) return dir;
    }

    return appScopedDir("db");
}

export async function getDocumentDir(): Promise<string> {
    const customDir = getStoredDirectory("document-dir");
    if (customDir) {
        const dir = await tryEnsureDirectory(customDir);
        if (dir) return dir;
    }

    // Mobile has no folder picker and no shared filesystem an app may write to,
    // so documents stay app-scoped instead of landing in ~/Documents.
    if (isMobile()) {
        return appScopedDir("documents");
    }

    try {
        return await ensureDirectory(await resolve(await documentDir(), APP_SLUG));
    } catch {
        return ensureDirectory(await resolve(await homeDir(), APP_SLUG));
    }
}

export async function getEnginesDir(): Promise<string> {
    const customDir = getStoredDirectory("engines-dir");
    if (customDir) {
        const dir = await tryEnsureDirectory(customDir);
        if (dir) return dir;
    }

    return appScopedDir("engines");
}

export async function getPuzzlesDir(): Promise<string> {
    const customDir = getStoredDirectory("puzzles-dir");
    if (customDir) {
        const dir = await tryEnsureDirectory(customDir);
        if (dir) return dir;
    }

    return appScopedDir("puzzles");
}
