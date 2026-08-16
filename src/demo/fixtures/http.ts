import { cloudEval } from "./miniEngine";
import { DEMO_GAME_PGN, SECOND_DEMO_GAME_PGN } from "./game";

export type FixtureRequest = {
    method: string;
    url: string;
    headers: [string, string][];
    body: number[] | null;
};

export type FixtureResponse = {
    status: number;
    statusText: string;
    headers: [string, string][];
    body: string | Uint8Array;
};

const JSON_HEADERS: [string, string][] = [
    ["content-type", "application/json; charset=utf-8"],
    ["access-control-allow-origin", "*"],
];

const PGN_HEADERS: [string, string][] = [
    ["content-type", "text/plain; charset=utf-8"],
    ["access-control-allow-origin", "*"],
];

const DEFAULT_ENGINES = [
    {
        type: "local",
        id: "stockfish-16-linux",
        name: "Stockfish 16.1",
        version: "16.1",
        path: "/demo/engines/stockfish",
        os: "linux",
        bmi2: true,
        elo: 3500,
        downloadSize: 40000000,
        downloadLink: "https://github.com/Mezdia/EnPassant/releases/download/demo/stockfish.zip",
        go: { t: "Depth", c: 18 },
        settings: [
            { name: "MultiPV", value: 1 },
            { name: "Threads", value: 4 },
            { name: "Hash", value: 512 },
        ],
    },
    {
        type: "local",
        id: "stockfish-16-linux-nobmi2",
        name: "Stockfish 16.1 (no BMI2)",
        version: "16.1",
        path: "/demo/engines/stockfish-nobmi2",
        os: "linux",
        bmi2: false,
        elo: 3450,
        downloadSize: 40000000,
        downloadLink: "https://github.com/Mezdia/EnPassant/releases/download/demo/stockfish.zip",
        go: { t: "Depth", c: 18 },
        settings: [
            { name: "MultiPV", value: 1 },
            { name: "Threads", value: 4 },
            { name: "Hash", value: 512 },
        ],
    },
    {
        type: "local",
        id: "stockfish-16-win32",
        name: "Stockfish 16.1 (Windows)",
        version: "16.1",
        path: "C:\\demo\\engines\\stockfish.exe",
        os: "win32",
        bmi2: true,
        elo: 3500,
        downloadSize: 40000000,
        downloadLink:
            "https://github.com/Mezdia/EnPassant/releases/download/demo/stockfish-win.zip",
        go: { t: "Depth", c: 18 },
        settings: [
            { name: "MultiPV", value: 1 },
            { name: "Threads", value: 4 },
            { name: "Hash", value: 512 },
        ],
    },
];

const DEFAULT_DATABASES = [
    {
        type: "success",
        title: "Mega Database 2024 (demo)",
        description: "A 9 million game database bundled for the demo.",
        player_count: 120000,
        event_count: 10000,
        game_count: 9000000,
        storage_size: 12000000000,
        filename: "mega2024.db3",
        indexed: true,
        downloadLink: "https://github.com/Mezdia/EnPassant/releases/download/demo/mega.db3",
    },
    {
        type: "success",
        title: "Titled Players Blitz (demo)",
        description: "Rated blitz games of titled players, 2024.",
        player_count: 3200,
        event_count: 240,
        game_count: 4500000,
        storage_size: 6000000000,
        filename: "titled-blitz.db3",
        indexed: true,
        downloadLink: "https://github.com/Mezdia/EnPassant/releases/download/demo/titled.db3",
    },
];

const DEFAULT_PUZZLE_DATABASES = [
    {
        title: "Lichess Puzzle Database (demo)",
        description: "The full lichess puzzle set, 4+ million puzzles.",
        downloadLink: "https://github.com/Mezdia/EnPassant/releases/download/demo/puzzles.db3",
        filename: "lichess-puzzles.db3",
        size: 800000000,
        count: 4000000,
    },
    {
        title: "Chess Tempo Standard (demo)",
        description: "Chess Tempo standard tactics subset.",
        downloadLink: "https://github.com/Mezdia/EnPassant/releases/download/demo/chesstempo.db3",
        filename: "chesstempo.db3",
        size: 500000000,
        count: 3000000,
    },
];

function json(body: unknown, status = 200): FixtureResponse {
    return {
        status,
        statusText: status === 200 ? "OK" : "Not Found",
        headers: JSON_HEADERS,
        body: JSON.stringify(body),
    };
}

function text(body: string, status = 200): FixtureResponse {
    return {
        status,
        statusText: status === 200 ? "OK" : "Not Found",
        headers: PGN_HEADERS,
        body,
    };
}

function notFound(): FixtureResponse {
    return json({ error: "Not found" }, 404);
}

/**
 * Routes every HTTP request the app makes through the demo's in-process mock.
 * This replaces the Tauri Rust HTTP client, so no request ever leaves the page.
 */
export function handleFixtureRequest(request: FixtureRequest): FixtureResponse {
    const url = new URL(request.url);
    const { host, pathname, searchParams } = url;
    const lower = host.toLowerCase();

    if (lower === "lichess.org" || lower === "www.lichess.org") {
        if (pathname.startsWith("/game/export/")) {
            const gameId = pathname.split("/").pop() ?? "";
            return text(gameId.includes("opera") ? SECOND_DEMO_GAME_PGN : DEMO_GAME_PGN);
        }
        if (pathname === "/api/cloud-eval") {
            const fen = searchParams.get("fen") ?? "";
            const multiPv = Number.parseInt(searchParams.get("multiPv") ?? "1", 10) || 1;
            const data = cloudEval(fen, multiPv);
            return data ? json(data) : notFound();
        }
        return notFound();
    }

    if (lower === "explorer.lichess.org") {
        return json({
            white: { results: 0, moves: [] },
            black: { results: 0, moves: [] },
            draws: 0,
        });
    }

    if (lower === "tablebase.lichess.org") {
        return notFound();
    }

    if (lower === "api.chess.com" || lower === "www.chess.com") {
        return notFound();
    }

    if (lower === "www.chessdb.cn") {
        return json({ status: "ok", bestMove: null });
    }

    if (lower === "app.posthog.com" || lower === "us.i.posthog.com") {
        return json({}, 200);
    }

    if (lower === "www.enpassant.ir" || lower === "enpassant.ir") {
        if (pathname === "/engines") {
            return json(DEFAULT_ENGINES);
        }
        if (pathname === "/databases") {
            return json(DEFAULT_DATABASES);
        }
        if (pathname === "/puzzle_databases") {
            return json(DEFAULT_PUZZLE_DATABASES);
        }
        return notFound();
    }

    return notFound();
}
