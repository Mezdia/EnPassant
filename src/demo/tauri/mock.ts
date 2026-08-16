import { handleFixtureRequest, type FixtureResponse } from "@/demo/fixtures/http";
import { DEMO_GAME_PGN, SECOND_DEMO_GAME_PGN, THIRD_DEMO_GAME_PGN } from "@/demo/fixtures/game";

/**
 * A browser-side mock of the Tauri v2 runtime (window.__TAURI_INTERNALS__).
 *
 * The EnPassant UI is a Tauri desktop app: every piece of data — game files,
 * engines, HTTP calls, dialogs, native menus — arrives through Tauri IPC.
 * This module re-implements just enough of that surface, backed by in-memory
 * fixtures, so the real UI components run unchanged against mock data.
 */

export type DemoPlatform = "linux" | "android";

let platformOverride: DemoPlatform = "linux";

const osPluginInternals: {
    platform: DemoPlatform;
    version: string;
    arch: string;
    family: string;
    eol: string;
    exeExtension: string;
} = {
    platform: platformOverride,
    version: "0.15.0-demo",
    arch: "x86_64",
    family: "Linux",
    eol: "\n",
    exeExtension: "",
};

/** Switch the reported OS; the UI adapts (desktop shell vs mobile layout). */
export function setDemoPlatform(platform: DemoPlatform): boolean {
    if (platformOverride === platform) return false;
    platformOverride = platform;
    osPluginInternals.platform = platform;
    return true;
}

// ---------------------------------------------------------------------------
// Callback plumbing (transformCallback)
// ---------------------------------------------------------------------------

type Callback = (payload: unknown) => void;

let callbackCounter = 0;
const callbacks = new Map<number, { cb: Callback; once: boolean }>();

function transformCallback(cb: Callback, once = false): number {
    const id = ++callbackCounter;
    callbacks.set(id, { cb, once });
    return id;
}

function unregisterCallback(id: number): void {
    callbacks.delete(id);
}

// ---------------------------------------------------------------------------
// Event bus (plugin:event|*)
// ---------------------------------------------------------------------------

type Listener = {
    id: number;
    handler: Callback;
    target: { kind: string; label?: string };
};

let eventIdCounter = 0;
const listeners = new Map<string, Listener[]>();

function matchesTarget(target: { kind: string; label?: string } | undefined): boolean {
    if (!target || target.kind === "Any") return true;
    if (target.kind === "AnyLabel") return true;
    if (target.kind === "Window" || target.kind === "Webview" || target.kind === "WebviewWindow") {
        return target.label === undefined || target.label === "main";
    }
    return true;
}

function deliverEvent(event: string, payload: unknown, target?: { kind: string; label?: string }) {
    const id = ++eventIdCounter;
    for (const listener of listeners.get(event) ?? []) {
        if (!matchesTarget(listener.target) || !matchesTarget(target)) continue;
        try {
            listener.handler({ event, id, payload });
        } catch (error) {
            console.error(`[demo] event listener for "${event}" failed:`, error);
        }
    }
}

// ---------------------------------------------------------------------------
// In-memory file system
// ---------------------------------------------------------------------------

const files = new Map<string, Uint8Array>();
const directories = new Set<string>();

function ensureDir(path: string): void {
    const parts = path.split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
        current += `/${part}`;
        directories.add(current);
    }
}

function writeFile(path: string, content: string | Uint8Array): void {
    const bytes = typeof content === "string" ? new TextEncoder().encode(content) : content;
    files.set(path, bytes);
    ensureDir(path.slice(0, path.lastIndexOf("/")));
}

function readFile(path: string): Uint8Array | null {
    return files.get(path) ?? null;
}

function readDir(path: string): { name: string; isFile: boolean; isDirectory: boolean }[] {
    const entries = new Map<string, { name: string; isFile: boolean; isDirectory: boolean }>();
    for (const dir of directories) {
        if (!dir.startsWith(path === "/" ? "/" : `${path}/`)) continue;
        const rest = dir.slice(path.length).replace(/^\//, "");
        if (rest && !rest.includes("/")) {
            entries.set(rest, { name: rest, isFile: false, isDirectory: true });
        }
    }
    for (const file of files.keys()) {
        if (!file.startsWith(path === "/" ? "/" : `${path}/`)) continue;
        const rest = file.slice(path.length).replace(/^\//, "");
        if (rest && !rest.includes("/")) {
            entries.set(rest, { name: rest, isFile: true, isDirectory: false });
        }
    }
    return [...entries.values()];
}

function fileInfo(path: string) {
    const entry = files.get(path);
    const isFile = entry !== undefined;
    const isDir = directories.has(path) && !isFile;
    return {
        isFile,
        isDirectory: isDir,
        isSymlink: false,
        size: isFile ? entry.byteLength : 0,
        mtime: 0,
        atime: 0,
        birthtime: 0,
        readonly: false,
        fileAttributes: [],
    };
}

const APP_DATA = "/demo/appdata";
const DOCUMENTS = "/demo/documents";
const HOME = "/demo/home";
const TEMP = "/demo/tmp";
const LOGS = "/demo/logs";

// Only the base directories the demo flow actually touches (AppData and
// AppLocalData both live under the app's data dir).
const BASE_DIRS: Record<number, string> = {
    1: APP_DATA, // AppData
    2: APP_DATA, // AppLocalData
};

function resolveBaseDir(options?: { baseDir?: number; dir?: string }): string {
    if (options?.dir) return options.dir;
    if (options?.baseDir !== undefined) return BASE_DIRS[options.baseDir] ?? APP_DATA;
    return "";
}

function asFsOptions(value: unknown): { baseDir?: number; dir?: string } | undefined {
    return value as { baseDir?: number; dir?: string } | undefined;
}

// ---------------------------------------------------------------------------
// HTTP response plumbing (plugin:http|*)
// ---------------------------------------------------------------------------

let httpRidCounter = 0;
const pendingResponses = new Map<number, FixtureResponse>();
const responseChunks = new Map<number, number[][]>();

function enqueueHttpResponse(response: FixtureResponse): number {
    const rid = ++httpRidCounter;
    pendingResponses.set(rid, response);
    // plugin-http read protocol: every non-final chunk is stripped of its
    // last byte (a marker) and the final chunk must be a bare [1] that closes
    // the stream WITHOUT carrying data. Each data chunk therefore gets a 0
    // marker appended; the terminator is a separate [1].
    const bytes =
        typeof response.body === "string"
            ? Array.from(new TextEncoder().encode(response.body))
            : Array.from(response.body);
    const chunks: number[][] = [];
    const chunkSize = 65536;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        chunks.push([...bytes.slice(i, i + chunkSize), 0]);
    }
    chunks.push([1]);
    responseChunks.set(rid, chunks);
    return rid;
}

function handleHttpFetch(clientConfig: {
    method: string;
    url: string;
    headers: [string, string][];
    data: number[] | null;
    maxRedirections?: number;
    connectTimeout?: number;
    proxy?: unknown;
    danger?: unknown;
}): number {
    const request = {
        method: clientConfig.method ?? "GET",
        url: clientConfig.url,
        headers: clientConfig.headers ?? [],
        body: clientConfig.data ?? null,
    };
    let response: FixtureResponse;
    try {
        response = handleFixtureRequest(request);
    } catch (error) {
        console.error(`[demo-mock] fixture error for ${request.url}:`, error);
        response = {
            status: 500,
            statusText: "Demo fixture error",
            headers: [["content-type", "application/json"]],
            body: JSON.stringify({ error: String(error) }),
        };
    }
    return enqueueHttpResponse(response);
}

// ---------------------------------------------------------------------------
// tauri-specta commands (see src/bindings/generated.ts)
// ---------------------------------------------------------------------------

function err(message: string) {
    return { status: "error" as const, error: message };
}

const SEEDED_ENGINES = JSON.stringify(
    [
        {
            type: "lichess",
            id: "lichess-cloud-eval",
            name: "Lichess Cloud Eval",
            url: "https://lichess.org/api",
            loaded: true,
            go: { t: "Infinite" },
        },
    ],
    null,
    4,
);

const NAG_BY_SYMBOL: Record<string, string> = {
    "!": "$1",
    "?": "$2",
    "!!": "$3",
    "??": "$4",
    "!?": "$5",
    "?!": "$6",
};

type DemoToken =
    | { type: "ParenOpen" }
    | { type: "ParenClose" }
    | { type: "Comment"; value: string }
    | { type: "San"; value: string }
    | { type: "Header"; value: { tag: string; value: string } }
    | { type: "Nag"; value: string }
    | { type: "Outcome"; value: string };

/**
 * Minimal PGN lexer producing the token shape the UI expects from the Rust
 * lex_pgn command. Handles headers, move numbers, SANs with annotation
 * suffixes, NAGs, comments, variations and results.
 */
function lexPgn(pgn: string): DemoToken[] {
    const tokens: DemoToken[] = [];
    const lines = pgn.split(/\r?\n/);
    let sawMoves = false;

    const pushNag = (symbols: string) => {
        if (symbols.length > 0) {
            tokens.push({ type: "Nag", value: NAG_BY_SYMBOL[symbols] ?? "$1" });
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === "") continue;

        if (!sawMoves && trimmed.startsWith("[")) {
            const match = /^\[\s*([A-Za-z0-9]+)\s+"([^"]*)"\s*\]$/.exec(trimmed);
            if (match) {
                tokens.push({
                    type: "Header",
                    value: { tag: match[1], value: match[2] },
                });
                continue;
            }
        }

        sawMoves = true;

        const parts = trimmed.match(/\S+/g) ?? [];
        for (const raw of parts) {
            if (/^\d+\.\.\.$/.test(raw)) continue;
            if (/^\d+\.$/.test(raw)) continue;
            if (raw === "(") {
                tokens.push({ type: "ParenOpen" });
                continue;
            }
            if (raw === ")") {
                tokens.push({ type: "ParenClose" });
                continue;
            }
            if (raw.startsWith("{")) {
                tokens.push({ type: "Comment", value: raw.slice(1, -1) });
                continue;
            }
            if (/^\$\d+$/.test(raw)) {
                tokens.push({ type: "Nag", value: raw });
                continue;
            }
            if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(raw)) {
                tokens.push({ type: "Outcome", value: raw });
                continue;
            }
            const match = /^([^!?]+)([!?]{1,2})$/.exec(raw);
            if (match) {
                tokens.push({ type: "San", value: match[1] });
                pushNag(match[2]);
                continue;
            }
            tokens.push({ type: "San", value: raw });
        }
    }

    return tokens;
}

function seedFileSystem(): void {
    writeFile(`${DOCUMENTS}/Immortal-Game.pgn`, DEMO_GAME_PGN);
    writeFile(`${DOCUMENTS}/Morphy-Opera-Game.pgn`, SECOND_DEMO_GAME_PGN);
    writeFile(`${DOCUMENTS}/Game-of-the-Century.pgn`, THIRD_DEMO_GAME_PGN);
    writeFile(
        `${DOCUMENTS}/My-Openings.pgn`,
        `[Event "Opening Repertoire"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "Your repertoire"]
[Black "?"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 *
`,
    );
    writeFile(`${APP_DATA}/engines/engines.json`, SEEDED_ENGINES);
    ensureDir(`${DOCUMENTS}/analysis`);
    writeFile(`${DOCUMENTS}/analysis/annotated-game.pgn`, DEMO_GAME_PGN);
    ensureDir("/demo/appdata/db");
    ensureDir("/demo/appdata/puzzles");
    ensureDir("/demo/appdata/engines");
}

seedFileSystem();

// ---------------------------------------------------------------------------
// invoke dispatcher
// ---------------------------------------------------------------------------

type InvokeArgs = Record<string, unknown>;

function invoke(
    cmd: string,
    args?: InvokeArgs | Uint8Array,
    options?: { headers?: Record<string, string> },
): Promise<unknown> {
    const payload = (args ?? {}) as InvokeArgs;
    const headers = options?.headers;
    const name = cmd.replace(/^plugin:/, "");

    switch (name) {
        // --- core / app / os ---
        case "app|version":
            return Promise.resolve("0.15.0-demo");
        case "os|platform":
            return Promise.resolve(platformOverride);
        case "os|locale":
            return Promise.resolve("en-US");
        case "os|hostname":
            return Promise.resolve("demo");
        case "log|log": {
            const level = String(payload.level ?? "info");
            const message = String(payload.message ?? "");
            const fn =
                level === "error" ? console.error : level === "warn" ? console.warn : console.log;
            fn(`[app] ${message}`);
            return Promise.resolve(null);
        }
        case "cli|cli_matches":
            return Promise.resolve({
                args: { file: { occurrences: 0, value: null } },
                subcommands: {},
            });

        // --- paths ---
        case "path|resolve_directory": {
            const directory = String(payload.directory ?? "");
            switch (directory) {
                case "appData":
                    return Promise.resolve(APP_DATA);
                case "appConfig":
                case "appLocalData":
                case "appCache":
                    return Promise.resolve(APP_DATA);
                case "appLog":
                    return Promise.resolve(LOGS);
                case "document":
                    return Promise.resolve(DOCUMENTS);
                case "home":
                    return Promise.resolve(HOME);
                case "temp":
                    return Promise.resolve(TEMP);
                case "download":
                    return Promise.resolve(`${HOME}/Downloads`);
                case "desktop":
                    return Promise.resolve(`${HOME}/Desktop`);
                default:
                    return Promise.resolve(`${HOME}/${directory}`);
            }
        }
        case "path|resolve": {
            const parts = Array.isArray(payload.paths)
                ? payload.paths
                : Array.isArray(payload.path)
                  ? payload.path
                  : [payload.path];
            return Promise.resolve(joinPaths(parts));
        }
        case "path|join": {
            const parts = Array.isArray(payload.paths) ? payload.paths : [];
            return Promise.resolve(joinPaths(parts));
        }
        case "path|basename":
            return Promise.resolve(String(payload.path).split("/").pop() ?? "");
        case "path|dirname":
            return Promise.resolve(String(payload.path).split("/").slice(0, -1).join("/") || "/");
        case "path|extname": {
            const base = String(payload.path).split("/").pop() ?? "";
            const dot = base.lastIndexOf(".");
            return Promise.resolve(dot > 0 ? base.slice(dot) : "");
        }
        case "path|normalize":
            return Promise.resolve(String(payload.path));
        case "path|is_absolute":
            return Promise.resolve(String(payload.path).startsWith("/"));
        case "path|resolve_resource":
            return Promise.resolve(`/sound/${String(payload.path).replace(/^sound\//, "")}`);

        // --- filesystem ---
        case "fs|read_text_file": {
            const path = headers ? decodeURIComponent(headers.path) : String(payload.path);
            const full = joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]);
            const entry = readFile(full);
            if (!entry) {
                return Promise.reject(new Error(`File not found: ${full}`));
            }
            return Promise.resolve(Array.from(entry));
        }
        case "fs|read_file": {
            const path = String(payload.path);
            const full = joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]);
            const entry = readFile(full);
            if (!entry) {
                return Promise.reject(new Error(`File not found: ${full}`));
            }
            return Promise.resolve(Array.from(entry));
        }
        case "fs|write_text_file": {
            const path = headers ? decodeURIComponent(headers.path) : String(payload.path);
            const parsedOptions = headers?.options ? JSON.parse(headers.options) : payload.options;
            const rawData = args instanceof Uint8Array ? args : payload.contents;
            const data =
                rawData instanceof Uint8Array
                    ? Array.from(rawData)
                    : Array.isArray(rawData)
                      ? (rawData as number[])
                      : [];
            writeFile(joinPaths([resolveBaseDir(parsedOptions), path]), new Uint8Array(data));
            return Promise.resolve(null);
        }
        case "fs|write_file": {
            const path = String(payload.path);
            const data = (payload.data as number[]) ?? [];
            writeFile(
                joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]),
                new Uint8Array(data),
            );
            return Promise.resolve(null);
        }
        case "fs|exists": {
            const path = String(payload.path);
            const full = joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]);
            return Promise.resolve(files.has(full) || directories.has(full));
        }
        case "fs|read_dir": {
            const path = String(payload.path);
            const full = joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]);
            return Promise.resolve(
                readDir(full).map((entry) => ({
                    ...entry,
                    isSymlink: false,
                    metadata: fileInfo(`${full}/${entry.name}`),
                })),
            );
        }
        case "fs|stat":
        case "fs|lstat": {
            const path = String(payload.path);
            const full = joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]);
            return Promise.resolve(fileInfo(full));
        }
        case "fs|mkdir": {
            const path = String(payload.path);
            ensureDir(joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]));
            return Promise.resolve(null);
        }
        case "fs|remove": {
            const path = String(payload.path);
            const full = joinPaths([resolveBaseDir(asFsOptions(payload.options)), path]);
            files.delete(full);
            directories.delete(full);
            return Promise.resolve(null);
        }
        case "fs|rename": {
            const oldPath = joinPaths([
                resolveBaseDir(asFsOptions(payload.options)),
                String(payload.oldPath),
            ]);
            const newPath = joinPaths([
                resolveBaseDir(asFsOptions(payload.options)),
                String(payload.newPath),
            ]);
            const entry = files.get(oldPath);
            if (entry) {
                files.delete(oldPath);
                files.set(newPath, entry);
            }
            return Promise.resolve(null);
        }
        case "fs|copy_file": {
            const from = joinPaths([
                resolveBaseDir(asFsOptions(payload.options)),
                String(payload.fromPath),
            ]);
            const to = joinPaths([
                resolveBaseDir(asFsOptions(payload.options)),
                String(payload.toPath),
            ]);
            const entry = files.get(from);
            if (entry) files.set(to, entry);
            return Promise.resolve(null);
        }
        case "fs|open":
        case "fs|read":
        case "fs|write":
        case "fs|fstat":
        case "fs|seek":
        case "fs|size":
        case "fs|truncate":
        case "fs|ftruncate":
        case "fs|watch":
            return Promise.reject(new Error(`fs command not supported in demo: ${name}`));

        // --- events ---
        case "event|listen": {
            const event = String(payload.event);
            const listener: Listener = {
                id: ++eventIdCounter,
                handler: (msg) => {
                    const cb = callbacks.get(Number(payload.handler));
                    cb?.cb(msg);
                },
                target: (payload.target as { kind: string; label?: string }) ?? { kind: "Any" },
            };
            const existing = listeners.get(event) ?? [];
            existing.push(listener);
            listeners.set(event, existing);
            return Promise.resolve(listener.id);
        }
        case "event|unlisten": {
            const event = String(payload.event);
            const eventId = Number(payload.eventId);
            listeners.set(
                event,
                (listeners.get(event) ?? []).filter((l) => l.id !== eventId),
            );
            return Promise.resolve(null);
        }
        case "event|emit": {
            deliverEvent(
                String(payload.event),
                payload.payload,
                payload.target as { kind: string; label?: string } | undefined,
            );
            return Promise.resolve(null);
        }
        case "event|emit_to": {
            deliverEvent(String(payload.event), payload.payload);
            return Promise.resolve(null);
        }

        // --- dialog ---
        case "dialog|open":
            return Promise.resolve(`${DOCUMENTS}/Immortal-Game.pgn`);
        case "dialog|ask":
        case "dialog|confirm":
            return Promise.resolve(false);
        case "dialog|message":
        case "dialog|save":
            return Promise.resolve(null);

        // --- window ---
        case "window|is_fullscreen":
        case "window|is_minimized":
        case "window|is_maximized":
        case "window|is_focused":
        case "window|is_visible":
        case "window|is_decorated":
        case "window|is_resizable":
        case "window|is_maximizable":
        case "window|is_minimizable":
        case "window|is_closable":
        case "window|is_enabled":
        case "window|is_always_on_top":
            return Promise.resolve(false);
        case "window|scale_factor":
            return Promise.resolve(1);
        case "window|inner_size":
        case "window|outer_size":
            return Promise.resolve({ width: window.innerWidth, height: window.innerHeight });
        case "window|inner_position":
        case "window|outer_position":
            return Promise.resolve({ x: 0, y: 0 });
        case "window|current_monitor":
        case "window|primary_monitor":
            return Promise.resolve(null);
        case "window|get_all_windows":
            return Promise.resolve(["main"]);
        default:
            if (name.startsWith("window|set_") || name.startsWith("window|")) {
                return Promise.resolve(null);
            }
            break;
    }

    switch (name) {
        // --- menu ---
        case "menu|new":
        case "menu|create_default": {
            const rid = ++httpRidCounter;
            return Promise.resolve([rid, `menu-${rid}`]);
        }
        case "menu|set_as_app_menu":
        case "menu|append":
        case "menu|prepend":
        case "menu|insert":
        case "menu|remove":
        case "menu|remove_at":
        case "menu|set_text":
        case "menu|set_enabled":
        case "menu|set_accelerator":
            return Promise.resolve(null);
        case "menu|items":
            return Promise.resolve([]);
        case "menu|text":
            return Promise.resolve("");
        case "menu|is_enabled":
            return Promise.resolve(true);

        // --- updater / process ---
        case "updater|check":
            return Promise.resolve(null);
        case "updater|download":
            return Promise.resolve({ archive: "" });
        case "updater|download_and_install":
        case "updater|install":
        case "process|exit":
        case "process|restart":
            return Promise.resolve(null);

        // --- http ---
        case "http|fetch": {
            const clientConfig = payload.clientConfig as {
                method: string;
                url: string;
                headers: [string, string][];
                data: number[] | null;
                maxRedirections?: number;
                connectTimeout?: number;
                proxy?: unknown;
                danger?: unknown;
            };
            return Promise.resolve(handleHttpFetch(clientConfig));
        }
        case "http|fetch_send": {
            const rid = Number(payload.rid);
            const response = pendingResponses.get(rid);
            if (!response) {
                return Promise.reject(new Error(`Unknown request id: ${rid}`));
            }
            return Promise.resolve({
                status: response.status,
                statusText: response.statusText,
                url: "",
                headers: response.headers,
                rid,
            });
        }
        case "http|fetch_read_body": {
            const rid = Number(payload.rid);
            const chunks = responseChunks.get(rid);
            if (!chunks || chunks.length === 0) {
                return Promise.resolve([1]);
            }
            return Promise.resolve(chunks.shift());
        }
        case "http|fetch_cancel":
        case "http|fetch_cancel_body":
            return Promise.resolve(null);

        // --- window-state ---
        case "window-state|filename":
            return Promise.resolve(null);
        case "window-state|restore_state":
            return Promise.resolve(null);
        case "window-state|save_window_state":
            return Promise.resolve(null);

        // --- tauri-specta commands ---
        //
        // NOTE: the generated bindings wrap every command's return value in a
        // `Result` envelope themselves (`{ status: "ok", data: ... }`), so the
        // mock returns the RAW value and lets the binding add the envelope.

        case "close_splashscreen":
        case "preload_reference_db":
        case "kill_engines":
        case "kill_engine":
        case "stop_engine":
        case "cancel_analysis":
        case "abort_game":
        case "clear_games":
        case "clear_progress":
        case "set_file_as_executable":
        case "write_game":
        case "write_db_game":
            return Promise.resolve(null);

        case "is_bmi2_compatible":
            return Promise.resolve(true);

        case "memory_size":
            return Promise.resolve(16384);

        case "get_sound_server_port":
            return Promise.resolve(0);

        case "file_exists": {
            const path = String(payload.path);
            return Promise.resolve(files.has(path));
        }

        case "count_pgn_games": {
            const path = String(payload.path);
            return Promise.resolve(readFile(path) ? 1 : 0);
        }

        case "read_games": {
            const path = String(payload.path);
            const entry = readFile(path);
            const pgn = entry ? new TextDecoder().decode(entry) : DEMO_GAME_PGN;
            return Promise.resolve([pgn]);
        }

        case "lex_pgn": {
            const pgn = String(payload.pgn);
            return Promise.resolve(lexPgn(pgn));
        }

        case "get_file_metadata":
            return Promise.resolve({ last_modified: Date.now() });

        case "get_engine_config":
            return Promise.resolve({
                name: "Stockfish 16.1",
                options: [
                    { name: "Threads", type: "Spin", default: 4, min: 1, max: 64 },
                    { name: "Hash", type: "Spin", default: 512, min: 16, max: 32768 },
                ],
            });

        case "get_engine_logs":
        case "get_game_engine_logs":
            return Promise.resolve([]);

        case "get_best_moves":
        case "analyze_game":
            return Promise.resolve(null);

        case "export_to_pgn":
            return Promise.resolve("");

        case "get_opening_from_fen":
        case "get_opening_from_fens":
        case "get_opening_from_name":
        case "search_opening_name":
            return Promise.resolve(null);

        case "get_progress":
            return Promise.resolve({ totalGames: 0, elapsedSeconds: 0 });

        case "download_file":
            return Promise.resolve(null);

        default:
            return Promise.resolve(err(`Command not available in the demo: ${name}`));
    }
}

function joinPaths(parts: unknown[]): string {
    const joined = parts
        .filter((p): p is string => typeof p === "string" && p.length > 0)
        .map((p) => p.replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""))
        .join("/");
    const first = parts.find((p): p is string => typeof p === "string" && p.length > 0);
    const absolute =
        first !== undefined && (first.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(first));
    return absolute ? `/${joined}` : joined;
}

export function installMockTauri(): void {
    if ((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__) {
        return;
    }

    const internals = {
        invoke,
        transformCallback,
        unregisterCallback,
        convertFileSrc: (filePath: string) => filePath,
        metadata: {
            currentWindow: { label: "main" },
            currentWebview: { label: "main" },
        },
        plugins: {
            path: { sep: "/", delimiter: ":" },
        },
    };

    Object.defineProperty(window, "__TAURI_INTERNALS__", {
        value: internals,
        configurable: true,
        writable: true,
    });

    Object.defineProperty(window, "__TAURI_OS_PLUGIN_INTERNALS__", {
        value: osPluginInternals,
        configurable: true,
        writable: true,
    });

    Object.defineProperty(window, "__TAURI_EVENT_PLUGIN_INTERNALS__", {
        value: {
            unregisterListener: (event: string, eventId: number) => {
                listeners.set(
                    event,
                    (listeners.get(event) ?? []).filter((l) => l.id !== eventId),
                );
            },
        },
        configurable: true,
        writable: true,
    });
}
