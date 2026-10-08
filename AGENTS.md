---
# EnPassant — Developer & AI Guardrails

## What this repository is

EnPassant is a **fork of [en-croissant](https://github.com/franciscoBSalgueiro/en-croissant)**
by franciscoBSalgueiro — a Tauri 2 (Rust) + React 19 (TypeScript) chess toolkit.

This fork differs from upstream in two ways, and both shape every rule below:

1. **An Android port.** Upstream is desktop-only (Windows/macOS/Linux). This fork
   also builds and ships APK/AAB for Android. Most fork-local code exists to make
   the same UI and backend work on a phone.
2. **An embeddable live demo** (`src/demo/`) published to a `demo-build` branch and
   consumed by the enpassant.ir website. See [Demo contract](#demo-contract-do-not-break)
   — it is a live, public-facing contract.

Everything else is intended to stay **as close to upstream as possible**.

---

## Prime directive: keep upstream mergeable

We regularly pull merges and cherry-pick PRs from
`franciscoBSalgueiro/en-croissant`. Upstream is active and does not know we exist.
**The cost of a fork-local edit is paid later, by whoever resolves the conflict.**

So: write Android support as _additions around_ upstream code, not as _rewrites of_
upstream code. When you have a choice, take the option that touches fewer upstream lines.

### Golden rules

1. **Prefer new files over edited files.** A new file never conflicts.
   `src/utils/platform.ts`, `src/utils/branding.ts`, `src/components/BottomTabBar.tsx`,
   `src/components/tabs/MobileBoardLayout.tsx`, `src-tauri/capabilities/desktop.json`
   are all fork-owned new files. Put new logic there, not inline in upstream components.

2. **Gate, never delete.** If a feature cannot work on Android, keep the upstream
   implementation intact and add a platform-gated sibling — do not remove or hollow
   out the upstream code path. Upstream still maintains that code; deleting it means
   every future upstream change to it conflicts.
   See `src-tauri/src/engine/process.rs:41-52`: two `spawn` functions, the Android one
   a stub returning `Error::LocalEnginesUnsupported`, the `#[cfg(not(target_os = "android"))]`
   one **byte-identical to upstream's**.

3. **One switch point, not a hundred conditionals.** Branch at a single boundary
   (`src/routes/__root.tsx`, `src/components/tabs/BoardsPage.tsx`) between an upstream
   component and a fork-owned `Mobile*` component. Do not thread `isMobile()` checks
   through the interior of upstream components — that scatters the diff and guarantees
   conflicts.

4. **Never reformat, rename, reorder, or restructure upstream code.** No repo-wide
   `pnpm format`, no renaming upstream files/symbols, no reordering imports or object
   keys, no "while I'm here" cleanups. A reformatted line is a conflicted line.
   Run `pnpm format` only on files you actually changed.

5. **Keep fork-only strings in fork-only files.** Product identity lives in
   `src/utils/branding.ts` (`APP_NAME`, `APP_REPOSITORY`, …) precisely so rebranding is
   a one-file change instead of edits scattered across upstream UI strings.

6. **Explain the _why_ at every divergence.** Leave a short comment stating the
   platform constraint, not the fact that it's a fork edit. This is the established
   convention and it's what makes a future merge resolvable by someone who wasn't there:
   ```ts
   // Mobile has no folder picker and no shared filesystem an app may write to,
   // so documents stay app-scoped instead of landing in ~/Documents.
   ```
   ```rust
   /// Android (API 29+) enforces W^X: an app may not `exec()` a binary living
   /// in writable storage, so a downloaded UCI engine can never start.
   ```

### Files that are conflict hotspots — edit with care

These are shared with upstream and _must_ be edited in place; keep fork additions
minimal, grouped, and appended rather than interleaved:

| File                        | Fork-local content                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `src-tauri/Cargo.toml`      | `tauri-plugin-deep-link`; the `[target.'cfg(...)'.dependencies]` desktop-only block |
| `src-tauri/tauri.conf.json` | `bundle.android.minSdkVersion`, `plugins.deep-link.mobile`, rebrand fields          |
| `src-tauri/src/lib.rs`      | plugin registration gating, mobile deep-link wiring in `setup`                      |
| `src/routes/__root.tsx`     | desktop/mobile shell switch                                                         |
| `src/App.tsx`               | mobile dir seeding, updater skip, splashscreen/OAuth ordering                       |
| `src/utils/directories.ts`  | app-scoped paths on mobile                                                          |
| `src/translation/*.json`    | fork-only keys (see i18n rule below)                                                |

---

## Where Android code belongs

| Concern                              | Location / pattern                                                                                                                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile entry point                   | `src-tauri/src/lib.rs` — `#[cfg_attr(mobile, tauri::mobile_entry_point)]` on `run()`                                                                                                   |
| Platform-split Rust logic            | `#[cfg(mobile)]` / `#[cfg(desktop)]` blocks inside a shared module, funneling into one shared function — the `src-tauri/src/oauth.rs` pattern                                          |
| Android-only Rust behavior           | `#[cfg(target_os = "android")]` stub returning a typed `Error` variant — the `engine/process.rs` pattern                                                                               |
| Crates that can't build for Android  | `[target.'cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))'.dependencies]` in `Cargo.toml`, **plus** `#[cfg(desktop)]` on the plugin registration in `lib.rs` |
| Permissions for desktop-only plugins | `src-tauri/capabilities/desktop.json` (has `"platforms"`) — **never** add `cli:` / `updater:` / `window-state:` perms to `main.json`                                                   |
| Mobile bundle config                 | inline in `tauri.conf.json`; there is deliberately **no** separate `tauri.android.conf.json`                                                                                           |
| Frontend platform checks             | always `src/utils/platform.ts` (`isMobile` / `isDesktop` / `isAndroid`)                                                                                                                |
| Orientation / layout                 | `src/utils/useIsLandscape.ts` (`useIsMobilePortrait`)                                                                                                                                  |
| Writable paths                       | `src/utils/directories.ts` — everything resolves under `appDataDir()` on mobile                                                                                                        |
| Mobile UI                            | dedicated `Mobile*` components, switched at one boundary                                                                                                                               |
| Android Gradle project               | **never hand-edit** `src-tauri/gen/android/` (see below)                                                                                                                               |

### `oauth.rs` is the reference pattern for a mobile feature

Lichess OAuth needs a redirect target. Desktop binds a throwaway loopback server;
Android cannot (no external browser can reach a port we bind), so it uses the
`enpassant://oauth/callback` deep link instead. The module splits _only the transport_
by `#[cfg]`, and both paths converge on a shared `exchange_code` that emits the same
`access_token` event. Upstream's OAuth logic stays recognisable; the fork owns the
mobile transport. Do the same for new platform-divergent features.

### Two Android facts that break naive code

- **W^X (API 29+):** an app may not `exec()` a binary in writable storage, so a
  _downloaded_ UCI engine can never start. Phase 1 of the engine port therefore offers
  **cloud engines only**; Phase 2 is planned to run an engine shipped in `jniLibs`
  in-process behind the same `BaseEngine::spawn` entry point. UI must gate on
  `isAndroid()` (`AddEngine.tsx`, `ReportModal.tsx`, `EnginesPage.tsx`).
- **No shared writable filesystem:** only `appDataDir()` is writable. There is no
  folder picker that returns a usable path, and no file manager that can open an
  app-private dir (`OpenFolderButton` renders `null` on mobile). Imported files are
  _copied_ into app storage, never referenced in place. Android SAF hands back
  `content://` URIs — `src/utils/importPgn.ts` parses those, and passes
  `filters: undefined` to the dialog because Android maps extension filters to MIME
  types and has none for `.pgn`.

### `src-tauri/gen/android/` is generated, not source

`src-tauri/gen/` is **gitignored**; CI regenerates it with
`pnpm tauri android init --ci --skip-targets-install` on every build.

> **Consequence:** any edit you make inside `gen/android/` is invisible to CI and will
> be silently lost. This has already happened — the local `MainActivity.kt` adds
> `enableEdgeToEdge()` (paired with `env(safe-area-inset-bottom)` in
> `BottomTabBar.module.css`), but because `gen/` isn't checked in, CI-built APKs do
> **not** get that tweak.

Durable Android customizations must live somewhere the build actually reads:

- launcher icons → `src-tauri/icons/android/` (CI copies them over the generated `res/`)
- manifest/gradle changes → a new explicit CI step in `.github/workflows/release.yml`
  that applies them after `tauri android init`, or upstream the change into
  `tauri.conf.json`
- anything else → raise it with the maintainer before assuming it will ship

The deep-link `intent-filter` is **not** in the source manifest — `tauri-plugin-deep-link`
injects it at build time from `plugins.deep-link.mobile`.

---

## Frontend conventions

- **Detect platform through `src/utils/platform.ts` only.** It wraps
  `@tauri-apps/plugin-os`'s `platform()` in a try/catch (`safePlatform()`) so unit tests
  and plain browsers don't throw, and defaults to desktop when undetectable. Never call
  `platform()` directly in a component. (The older `usePlatform()` SWR hook in
  `src/utils/files.ts` predates this — don't spread it further.)
- **Desktop-only Tauri APIs must be guarded**: native menus, window decorations,
  `DRAG_DROP` file drops, `@tauri-apps/plugin-cli` `getMatches()`, and the updater.
  All are gated in `__root.tsx` / `App.tsx` with a comment naming the constraint.
- **Android updates ship via the Play Store**, so `checkForUpdates` early-returns on
  mobile and `tauri-plugin-updater` is desktop-only.
- **Cold-start ordering contract:** `App.tsx` registers the `access_token` listener
  _before_ calling `commands.closeSplashscreen()`. The Rust side queues deep-link tokens
  until that call (`oauth::webview_ready`). Don't reorder these.
- **Mobile settings are a separate category.** `SettingsPage` swaps the desktop-only
  `keybinds` category for a `mobile` one (haptics, tap-to-move, flip-on-double-tap).
- **i18n:** add new user-facing strings via `t()`, then run `pnpm i18n:extract` so every
  locale file under `src/translation/` is updated (`lint:ci` fails otherwise). Namespace
  fork-only keys so they stay grouped and re-appliable across merges — the existing
  convention is a `Mobile`/`Android` segment, e.g. `Settings.Mobile.TapToMove`,
  `Board.Opponent.AndroidEngineNote`.

---

## Verification before you finish

```bash
pnpm lint:ci      # tsgo --noEmit + oxfmt --check + oxlint + i18n extract check
pnpm test         # vitest
pnpm build:demo   # demo bundle must still build
```

For anything touching `src-tauri/`, also check **both** cfg branches compile:

```bash
cd src-tauri && cargo check                                   # desktop
cd src-tauri && cargo check --target aarch64-linux-android    # needs the NDK
```

A `#[cfg]` typo means one platform silently fails to compile, and desktop-only CI will
not catch it.

**Cheapest way to test the mobile UI:** `pnpm dev:demo` in a browser. The demo mock
reports `"android"` below a viewport breakpoint (`src/demo/bootstrap.ts` →
`setDemoPlatform`), so narrowing the window exercises the real mobile layout,
`BottomTabBar`, and `MobileBoardLayout` without an emulator. Use this first; reserve
`pnpm tauri android dev` for platform-API behavior (deep links, SAF, haptics).

Full Android build (JDK 17 + SDK platform 34 + NDK, `NDK_HOME`/`ANDROID_HOME` set):

```bash
pnpm tauri android init
cp -R src-tauri/icons/android/. src-tauri/gen/android/app/src/main/res/
pnpm tauri android build --apk --aab
```

CI publishes these to a separate `vX.Y.Z-android` **pre-release**, keeping the desktop
release stable; `.github/scripts/sign-android.sh` aligns and signs outside Gradle so no
keystore secret is ever written into the generated project.

---

## Pulling changes from upstream

```bash
git remote add upstream https://github.com/franciscoBSalgueiro/en-croissant.git
git fetch upstream
git merge upstream/master        # or: git cherry-pick <upstream-sha>
```

When resolving conflicts:

1. **Take upstream's version of any line that isn't platform-specific.** Our edits are
   supposed to be additive; if a conflict is inside upstream logic, we probably drifted
   and upstream should win.
2. **Re-apply the fork deltas deliberately**, not by keeping "ours": `Cargo.toml`
   deep-link dep + desktop-only target block, `tauri.conf.json` android/deep-link/branding
   keys, `capabilities/desktop.json`, the `#[cfg]` gates in `lib.rs` / `oauth.rs` /
   `engine/process.rs`, and the switch points in `__root.tsx` / `App.tsx`.
3. **New upstream Tauri commands or plugins:** ask whether they work on Android. If a
   new plugin is desktop-only, it goes in the `Cargo.toml` target block _and_
   `capabilities/desktop.json` _and_ a `#[cfg(desktop)]` registration — all three, or
   the Android build breaks.
4. **New upstream UI:** check it on a narrow viewport via `pnpm dev:demo` before
   declaring the merge clean.
5. Re-run the full verification block above, then `pnpm build`.

---

## Demo contract (do not break)

This repository contains an **embeddable live demo** of the app. It is consumed
by the enpassant.ir website (and mirrors), so breaking it breaks other
deployments. Treat `src/demo/` and the `demo-build` publishing pipeline as a
live contract.

### What exists

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

### Hard invariants

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

### Safe development (encouraged)

- Adding fixture games, engine responses (mini engine at
  `src/demo/fixtures/miniEngine.ts`), filesystem seeds, or new autoplay steps
  is safe as long as the invariants above hold.
- Extending the mock surface for new screens is safe: add handlers in
  `src/demo/tauri/mock.ts` with raw returns.
- The demo mock also fakes the OS plugin (`DemoPlatform = "linux" | "android"`),
  which is what makes the mobile layout testable in a browser. Keep that surface
  working when you add platform branches.
- Before merging anything that touches `src/demo/`, the website pipeline,
  `demo.yml`, or `src/App.tsx`, run: `pnpm lint:ci && pnpm test && pnpm build:demo`.

---

When in doubt, ask the maintainer — this fork is public-facing, and an
unmergeable change costs everyone downstream.

---
