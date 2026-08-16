import { setDemoPlatform, type DemoPlatform } from "./tauri/mock";

const MOBILE_BREAKPOINT = 767;

/**
 * Prepare the browser environment before the real App component mounts:
 * seed persisted state (language, theme, directories, recent files) and
 * neutralise analytics traffic so the demo never talks to the outside world.
 */
export function bootstrapDemo(): void {
    seedLocalStorage();
    installAnalyticsGuard();
    installResponsivePlatform();
}

function seedLocalStorage(): void {
    const set = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            // storage may be unavailable in some embed contexts; the app tolerates it
        }
    };

    set("i18nextLng", "en-US");
    set("mantine-color-scheme", "dark");
    set("telemetry-enabled", "false");

    // Directory overrides (matching the mock filesystem in ./tauri/mock.ts)
    set("document-dir", JSON.stringify("/demo/documents"));
    set("databases-dir", JSON.stringify("/demo/appdata/db"));
    set("engines-dir", JSON.stringify("/demo/appdata/engines"));
    set("puzzles-dir", JSON.stringify("/demo/appdata/puzzles"));

    // A couple of recently opened files so the home screen looks alive
    set(
        "recent-files",
        JSON.stringify([
            {
                name: "Immortal-Game.pgn",
                path: "/demo/documents/Immortal-Game.pgn",
                type: "game",
                lastOpened: Date.now() - 1000 * 60 * 60 * 5,
            },
            {
                name: "Morphy-Opera-Game.pgn",
                path: "/demo/documents/Morphy-Opera-Game.pgn",
                type: "game",
                lastOpened: Date.now() - 1000 * 60 * 60 * 26,
            },
        ]),
    );
}

/** Short-circuit analytics requests (posthog) so nothing leaves the page. */
function installAnalyticsGuard(): void {
    const isAnalytics = (url: string) => /(^|\.)posthog\.com\//.test(url);

    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
        const url =
            typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (isAnalytics(url)) {
            return Promise.resolve(new Response("{}", { status: 200 }));
        }
        return nativeFetch(input, init);
    };

    const XHR = window.XMLHttpRequest;
    type GuardedXhr = XMLHttpRequest & { _demoAnalytics?: boolean };
    const originalOpen = XHR.prototype.open;
    XHR.prototype.open = function (
        this: GuardedXhr,
        method: string,
        url: string | URL,
        async?: boolean,
        user?: string | null,
        password?: string | null,
    ) {
        if (typeof url === "string" && isAnalytics(url)) {
            this._demoAnalytics = true;
            return;
        }
        return originalOpen.call(this, method, url, async ?? true, user, password);
    };
    const originalSend = XHR.prototype.send;
    XHR.prototype.send = function (
        this: GuardedXhr,
        body?: Document | XMLHttpRequestBodyInit | null,
    ) {
        if (this._demoAnalytics) {
            Object.defineProperties(this, {
                status: { value: 200, configurable: true },
                responseText: { value: "{}", configurable: true },
                readyState: { value: 4, configurable: true },
            });
            window.setTimeout(() => this.dispatchEvent(new Event("load")), 0);
            return;
        }
        return originalSend.call(this, body);
    };
}

/**
 * The app has real layouts for both desktop and mobile (Android). Report the
 * platform that matches the current viewport width so the embedded demo looks
 * native on every screen, and switch live when the breakpoint is crossed.
 */
function installResponsivePlatform(): void {
    const apply = () => {
        const platform: DemoPlatform = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
            .matches
            ? "android"
            : "linux";
        const changed = setDemoPlatform(platform);
        if (changed) {
            // Force the router to re-render so isMobile()-driven layouts switch
            window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
        }
    };

    apply();
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).addEventListener("change", apply);
}
