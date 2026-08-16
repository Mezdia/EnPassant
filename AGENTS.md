---
# EnPassant — Developer & AI Guardrails

This repository contains an **embeddable live demo** of the app. It is consumed
by the enpassant.ir website (and mirrors), so breaking it breaks other
deployments. Treat `src/demo/` and the `demo-build` publishing pipeline as a
live contract.

## What exists

- `src/demo/` — an isolated demo build that boots the REAL UI against an
  in-process mock of the Tauri runtime and the network. Nothing in it ever
  touches a real backend.
- `vite.config.demo.ts` + `demo/index.html` — build entry; **must stay in
  sync with the main app**. Output: `dist-demo/` (gitignored).
- `.github/workflows/demo.yml` — on every push to `master` it builds the demo
  and force-pushes `dist-demo` to the **`demo-build`** branch. The branch root
  IS the bundle (index.html, assets/, pieces/, board/, mockServiceWorker.js).
  The website fetches this branch; jsdelivr mirrors it as the runtime
  fallback. **Changing the branch layout breaks both.**
- `src/App.tsx` — derives the router basepath from the page URL so the app
  works at `/`, `/demo/`, or a CDN prefix. Keep this derivation.
- `DEMO.md` — architecture, fixtures, autoplay editing guide.

## Hard invariants (do not break)

1. **Import order**: `src/demo/main.tsx` MUST import `./setup` before any
   other module. Several app modules (`TopBar`, `keybinds`) call Tauri APIs at
   module scope; the mock must be installed before the App module graph
   evaluates.
2. **Raw command returns**: commands implemented in
   `src/demo/tauri/mock.ts` return **raw values** — the generated bindings
   wrap them in `{status:"ok",data}` themselves. Never return an envelope from
   the mock.
3. **All app HTTP goes through the mock**: the app fetches via Tauri IPC
   (`plugin:http|fetch`), never browser `fetch`; the mock routes requests to
   fixtures. The body-stream protocol (chunk + marker byte, final `[1]`) must
   not change.
4. **No real network**: analytics (posthog) is blocked by the inline guard in
   `src/demo/bootstrap.ts`. MSW is dev-only because service workers cannot run
   in cross-origin iframes — don't move interception to MSW.
5. **Random default game**: `sessionStorage` is cleared at boot and a random
   game from `RANDOM_DEMO_GAMES` (`src/demo/fixtures/game.ts`) opens in the
   analysis tab. Keep this behavior.
6. **Autoplay resilience**: steps in `src/demo/autoplay.ts` are best-effort
   (a failing step must skip, never crash the tour). Chessground only accepts
   trusted input — the autoplay must navigate via the move list, not board
   drags.
7. **CI stability**: `pnpm build:demo`, `pnpm lint:ci`, and `pnpm test` must
   stay green.

## Safe development (encouraged)

- Adding fixture games, engine responses (mini engine at
  `src/demo/fixtures/miniEngine.ts`), filesystem seeds, or new autoplay steps
  is safe as long as the invariants above hold.
- Extending the mock surface for new screens is safe: add handlers in
  `src/demo/tauri/mock.ts` with raw returns.
- Before merging anything that touches `src/demo/`, the website pipeline,
  `demo.yml`, or `src/App.tsx`, run: `pnpm lint:ci && pnpm test && pnpm
  build:demo`.

When in doubt, ask the maintainer — the demo is a public-facing artifact.
---
