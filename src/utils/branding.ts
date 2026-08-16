/**
 * Single source of truth for user-visible product identity, so a rename is a
 * one-file change instead of a grep across the UI.
 */
export const APP_NAME = "EnPassant";

/**
 * Compact, token-safe spelling of {@link APP_NAME} for places that cannot take
 * punctuation — HTTP `User-Agent`s, directory names.
 */
export const APP_SLUG = "EnPassant";

/** Developer credited in the About dialog and the bundle metadata. */
export const APP_AUTHOR = "Mezdia";

/** Developer's profile, linked from the About dialog. */
export const APP_AUTHOR_URL = "https://github.com/Mezdia";

/** First year of publication, used for the About dialog's copyright line. */
export const APP_COPYRIGHT_YEAR = "2025";

/** Marketing site, linked from the About dialog. */
export const APP_WEBSITE = "https://www.enpassant.ir";

/** Documentation, linked from the Help menu. */
export const APP_DOCS_URL = "https://enpassant.ir/docs/";

/** Source repository, linked from the About dialog and sent as `User-Agent`. */
export const APP_REPOSITORY = "https://github.com/Mezdia/EnPassant";

/** Pre-filled bug report, linked from the crash screen. */
export const APP_ISSUES_URL = `${APP_REPOSITORY}/issues/new?assignees=&labels=bug&projects=&template=bug.yml`;

/** Chat, also linked from the crash screen. */
export const APP_DISCORD_URL = "https://discord.com/";
