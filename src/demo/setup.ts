import { installMockTauri } from "./tauri/mock";
import { bootstrapDemo } from "./bootstrap";
import { initDemoI18n } from "./i18n";

/**
 * Side-effect setup module. It must be imported BEFORE the App module graph:
 * several app modules call Tauri APIs at module scope (TopBar's
 * getCurrentWebviewWindow, keybinds' platform()), so the runtime shim and the
 * seeded environment have to be live the moment those modules evaluate.
 */

// Normalise the page URL so the router always mounts at "/". The demo can be
// served as .../index.html (website /demo/, CDN mirrors); pointing the path
// at the parent directory keeps TanStack Router's basepath derivation simple
// without triggering a navigation.
if (window.location.pathname.endsWith("/index.html")) {
    const base = window.location.pathname.slice(0, -"index.html".length);
    window.history.replaceState(
        null,
        "",
        `${base}${window.location.search}${window.location.hash}`,
    );
}

// Fresh tab state on every load: main.tsx opens a random fixture game, so a
// page refresh rolls a new one instead of restoring the previous session.
sessionStorage.clear();

bootstrapDemo();
installMockTauri();
initDemoI18n();
