import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

/**
 * MSW (Mock Service Worker) harness for local development of the demo build.
 *
 * The deployed demo runs inside a cross-origin iframe where browsers do not
 * allow service workers (Safari blocks them in iframes entirely), and the
 * app's data layer speaks Tauri IPC rather than browser fetch — so the
 * production artifact routes fixtures through the in-process mock in
 * ./tauri/mock.ts instead. Here, the worker intercepts the only real
 * browser-level traffic the app makes (analytics) so `pnpm dev` behaves
 * exactly like the deployed artifact.
 */
export async function startDemoWorker(): Promise<boolean> {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
        return false;
    }

    const worker = setupWorker(
        http.all("https://*.posthog.com/*", () => HttpResponse.json({}, { status: 200 })),
        http.all("https://app.posthog.com/*", () => HttpResponse.json({}, { status: 200 })),
    );

    try {
        const pageUrl = window.location.pathname;
        const workerUrl = `${pageUrl.replace(/[^/]*$/, "")}mockServiceWorker.js`;
        await worker.start({
            serviceWorker: {
                url: workerUrl,
            },
            onUnhandledRequest: "bypass",
            quiet: true,
        });
        return true;
    } catch (error) {
        console.warn("[demo] MSW worker unavailable, using inline analytics guard:", error);
        return false;
    }
}
