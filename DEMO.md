# Demo mode

EnPassant ships a self-contained, embeddable demo that runs the **real UI**
against an in-process mock of the Tauri backend and the network, so it can be
embedded in any web page — like the enpassant.ir homepage — with zero backend
or deployment dependencies.

```bash
pnpm dev:demo              # vite dev server on :1422 -> http://localhost:1422/demo/
pnpm build:demo            # typecheck + vite build -> dist-demo/
```

The output lives in `dist-demo/` (gitignored). `demo/index.html` is the entry.
The build keeps the page next to its assets — `dist-demo/demo/index.html`,
`dist-demo/demo/assets/`, `dist-demo/demo/mockServiceWorker.js` — plus
`dist-demo/pieces/` and `dist-demo/board/`, and links the assets as
`../demo/assets/…`. Serve the `dist-demo/` root and open **`/demo/`**; on that
static server `/` is only a directory listing, and copying the bundle to a root
breaks the asset paths:

```bash
python3 -m http.server 4173 --directory dist-demo
# http://localhost:4173/demo/
```

## How it works

| Layer               | Location                                 | Role                                                                                                                                             |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Demo entry          | `src/demo/main.tsx`, `src/demo/setup.ts` | installs the Tauri shim before the App module graph evaluates, picks a random fixture game, opens it in the analysis tab, then renders `<App />` |
| Environment seeding | `src/demo/bootstrap.ts`                  | en-US, dark theme, telemetry off, directory + recent-file seeds                                                                                  |
| Tauri runtime mock  | `src/demo/tauri/mock.ts`                 | reimplements `window.__TAURI_INTERNALS__` (invoke, events, fs, path, dialogs, menus, window) over an in-memory filesystem                        |
| HTTP fixtures       | `src/demo/fixtures/http.ts`              | routes every app request (Lichess, Chess.com, ChessDB, enpassant.ir, posthog) to fixture data                                                    |
| Mini engine         | `src/demo/fixtures/miniEngine.ts`        | a tiny chessops-based evaluator that serves the Lichess "cloud eval" endpoint, so the eval bar shows real computed lines                         |
| Fixture games       | `src/demo/fixtures/game.ts`              | three demo PGNs (Immortal Game, Opera Game, Game of the Century) — one is picked at random per page load                                         |
| MSW (dev only)      | `src/demo/msw.ts`                        | intercepts analytics for local dev; the deployed artifact uses the inline guard instead (service workers don't run in cross-origin iframes)      |
| Autoplay            | `src/demo/autoplay.ts`                   | scripted, human-looking walkthrough driven by real DOM events; aborts on the first trusted `pointerdown`/`click`                                 |
| Height reporting    | `src/demo/autoplay.ts`                   | `postMessage({source:"enpassant-demo", type:"resize", height})` whenever the content resizes                                                     |
| Router basepath     | `src/App.tsx`                            | derives the router basepath from the page URL so routes work at `/`, `/demo/`, or a CDN prefix                                                   |
| Phone preview       | `demo/mobile-preview.html`               | dev-only frame at four phone sizes; not a build input, so it never ships                                                                         |

## The default session

Every page load (refresh included) starts with a **random one of the three
fixture games already open in the analysis tab** — like a session that was
left running. `sessionStorage` is cleared at boot so a refresh rolls a new
game.

## Phone preview

`demo/mobile-preview.html` is the dev-only way to look at the mobile UI. It
frames the demo in a real CSS viewport and switches between four presets
(360×800, 390×844, 412×915, 768×1024), so the app's 767px platform switch, the
mobile shell (`BottomTabBar`, `MobileBoardLayout`) and every media query behave
as they do on a device.

```bash
pnpm dev:demo
# http://localhost:1422/demo/mobile-preview.html
```

- It is **not** a Vite build input: it never reaches `dist-demo/` or the
  `demo-build` branch, and it frames `index.html` from its own directory, so it
  keeps working under any base path.
- Opening `/demo/` in a narrow window also reports `"android"`
  (`installResponsivePlatform` in `src/demo/bootstrap.ts`), but the harness
  gives an exact viewport and a device-sized frame without touching devtools.
- It cannot fake `env(safe-area-inset-*)` — those stay 0 in a desktop browser,
  so status-bar and gesture-bar insets still have to be checked on a phone.
  For that, start the dev server with `--host` (`pnpm dev:demo --host`) and open
  the same path from the phone on the LAN, or put a tunnel in front of it
  (`cloudflared tunnel --url http://localhost:1422`); the common tunnel domains
  are already listed in `server.allowedHosts` in `vite.config.demo.ts`.

## Why the mock is in-process instead of MSW

1. The app is a Tauri desktop app: **every** piece of data (games, engines,
   HTTP calls, dialogs) arrives through Tauri IPC, not browser `fetch`. The
   layers to swap are the `invoke()` bindings — not the network stack.
2. Service workers (which MSW relies on) are **not allowed in cross-origin
   iframes** (Safari blocks them entirely), and the demo ships inside an iframe
   on enpassant.ir. MSW is kept for local development only (`pnpm dev:demo`),
   where it blocks analytics traffic; the production build uses the inline
   guard in `src/demo/bootstrap.ts`.

Both paths share the same fixture source so dev and the deployed artifact
behave identically.

## Updating fixture data

- **Games**: edit `src/demo/fixtures/game.ts` and add the file to
  `RANDOM_DEMO_GAMES` (the mock filesystem seeds it automatically via
  `seedFileSystem` in `src/demo/tauri/mock.ts`). The notation's SANs are read
  from the parsed tree, so new games work with the autoplay unchanged.
- **Engines**: `SEEDED_ENGINES` in `src/demo/tauri/mock.ts` (the "Lichess Cloud
  Eval" engine that powers the scripted eval bar).
- **Engine lines/scores**: `src/demo/fixtures/miniEngine.ts` computes real
  evaluations for any position using chessops — no canned scores to update.
- **Files screen**: the in-memory filesystem seeds in `src/demo/tauri/mock.ts`
  (`seedFileSystem`).
- **Cloud eval responses**: extend the routes in `src/demo/fixtures/http.ts`.

## Editing the autoplay script

`buildScenario()` in `src/demo/autoplay.ts` is a list of named steps with
`pauseAfterMs`. Each step is best-effort: failures log a warning and the tour
continues. Helpers (`clickText`, `clickSelector`, `waitFor`,
`clickMainlineMove`) drive real DOM events — the same handlers a human would
trigger. The tour reviews the opening, watches the pieces move through the
middlegame, jumps to the final position and back, turns the cloud engine on,
reviews and rescales the engine lines (MultiPV up and down), visits the
Info/Annotate tabs, opens a different game from the Files screen, and drops
into Settings. Open the demo with `?autoplay=0` to disable the tour while
testing.

> Note: chessground only accepts trusted input events, so the autoplay
> navigates the board through the move list (the pieces still animate on
> screen); actual drag-moves work for the visitor after the hand-off.

## CI and the demo-build branch

`.github/workflows/demo.yml` builds `dist-demo` on every push to `master` and
runs `.github/scripts/publish-demo.sh`, which force-pushes the bundle to the
`demo-build` branch: the contents of `dist-demo/demo/` sit at the branch root
(`index.html`, `assets/`, `mockServiceWorker.js`), next to `pieces/` and
`board/`.

The built `index.html` links its assets as `../demo/assets/…`, so the bundle is
only self-consistent when it is mounted under a `/demo/` path — which is what
the website does (<https://www.enpassant.ir/demo/>). Served from a bare domain
root, those links resolve to `/demo/assets/…` and 404; that is why the branch
root is a source for the site's `/demo/` mount, not a page you can open
directly. jsDelivr is an asset mirror at best — it serves GitHub `.html` files
as `text/plain`, so it cannot run the demo.

> Known issue: `publish-demo.sh` only removes tracked files from the orphan
> branch before `git add -A`, so `.gitignore` disappears first and CI's
> `node_modules/`, `dist-demo/` and `tsconfig.tsbuildinfo` are committed to
> `demo-build` as well. Nothing reads them; it just makes that branch huge.
