import { type Platform, platform } from "@tauri-apps/plugin-os";

/**
 * Synchronous, test-safe platform detection.
 *
 * `platform()` from `@tauri-apps/plugin-os` reads a value injected by the Tauri
 * runtime and is synchronous, but it throws when the Tauri APIs are unavailable
 * (e.g. in unit tests / plain browser). These helpers swallow that so callers
 * can branch on platform without try/catch at every call site.
 */
function safePlatform(): Platform | null {
    try {
        return platform();
    } catch {
        return null;
    }
}

const MOBILE_PLATFORMS: ReadonlySet<Platform> = new Set<Platform>(["android", "ios"]);

/** True on Android or iOS. Returns false when platform can't be determined. */
export function isMobile(): boolean {
    const p = safePlatform();
    return p !== null && MOBILE_PLATFORMS.has(p);
}

/** True on Windows, macOS, or Linux. Returns true when platform can't be determined (desktop-first default). */
export function isDesktop(): boolean {
    return !isMobile();
}

/** True on Android specifically. */
export function isAndroid(): boolean {
    return safePlatform() === "android";
}
