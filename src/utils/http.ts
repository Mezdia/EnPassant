import { getVersion } from "@tauri-apps/api/app";
import { APP_REPOSITORY, APP_SLUG } from "@/utils/branding";

let userAgent = APP_SLUG;

export async function initUserAgent(): Promise<void> {
    try {
        const version = await getVersion();
        userAgent = `${APP_SLUG}/${version} (${APP_REPOSITORY})`;
    } catch {
        userAgent = `${APP_SLUG} (${APP_REPOSITORY})`;
    }
}

export function apiHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
        "User-Agent": userAgent,
        ...extra,
    };
}
