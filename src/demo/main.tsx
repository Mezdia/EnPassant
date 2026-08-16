/**
 * Demo entry — boots the REAL EnPassant UI against a fully mocked Tauri
 * runtime and network, opens a random fixture game in the analysis tab, then
 * runs a scripted autoplay tour that hands control to the visitor on first
 * interaction.
 *
 * IMPORTANT: "./setup" must be the first import. Several app modules call
 * Tauri APIs at module scope (e.g. TopBar's getCurrentWebviewWindow), so the
 * runtime shim has to be installed before the App module graph evaluates.
 */
import "./setup";
import { startDemoWorker } from "./msw";
import { startAutoplay, installResizeReporter, type AutoplayContext } from "./autoplay";
import { RANDOM_DEMO_GAMES } from "./fixtures/game";
import App from "@/App";
import { createRoot } from "react-dom/client";

type PreparedSession = {
  file: string;
  moves: string[];
};

/**
 * Open a random fixture game in the analysis tab BEFORE the first render,
 * exactly the way the app does when a user opens a file: parse the PGN,
 * store the tree in sessionStorage under the tab id, and seed the tabs atom.
 */
async function prepareDemoSession(): Promise<PreparedSession> {
  const chosen = RANDOM_DEMO_GAMES[Math.floor(Math.random() * RANDOM_DEMO_GAMES.length)];

  const [{ parsePGN }, { getGameName }, { genID }, { getDefaultStore }, atoms] = await Promise.all([
    import("@/utils/chess"),
    import("@/utils/treeReducer"),
    import("@/utils/tabs"),
    import("jotai"),
    import("@/state/atoms"),
  ]);

  const tree = await parsePGN(chosen.pgn);
  const id = genID();

  const tab = {
    name: getGameName(tree.headers),
    value: id,
    type: "analysis" as const,
    gameOrigin: {
      kind: "file" as const,
      gameNumber: 0,
      file: {
        type: "file" as const,
        name: chosen.file,
        path: `/demo/documents/${chosen.file}`,
        numGames: 1,
        metadata: { tags: [], type: "game" as const },
        lastModified: Date.now(),
      },
    },
  };

  sessionStorage.setItem(id, JSON.stringify({ version: 0, state: tree }));

  const store = getDefaultStore();
  store.set(atoms.tabsAtom, [tab]);
  store.set(atoms.activeTabAtom, id);

  const moves: string[] = [];
  let node = tree.root;
  while (node.children.length > 0) {
    node = node.children[0];
    if (node.san) {
      moves.push(node.san);
    }
  }

  return { file: chosen.file, moves };
}

const autoplayParam = new URLSearchParams(window.location.search).get("autoplay");
const autoplayEnabled = autoplayParam !== "0";

const container = document.getElementById("app");
if (!container) {
  throw new Error("Demo entry: #app root not found");
}

void startDemoWorker().then(async () => {
  const session = await prepareDemoSession();

  const root = createRoot(container);
  root.render(<App />);

  installResizeReporter();

  const context: AutoplayContext = {
    file: session.file,
    moves: session.moves,
  };
  const { stop } = startAutoplay({ enabled: autoplayEnabled, context });

  window.addEventListener("unload", stop);

  // Debug handle: allow embedding pages to stop the tour
  (window as unknown as Record<string, unknown>).__enpassantDemo = {
    stopAutoplay: stop,
  };
});
