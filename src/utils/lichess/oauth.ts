import { getDefaultStore } from "jotai";
import { sessionsAtom } from "@/state/atoms";
import { getLichessAccount } from "@/utils/lichess/api";

/**
 * Player alias picked in the "add account" dialog, kept until the OAuth
 * redirect comes back.
 *
 * `localStorage` rather than `sessionStorage`: on Android the redirect is a deep
 * link that may cold-start the app, which session storage would not survive.
 */
export const LICHESS_ALIAS_KEY = "lichess_player_alias";

/**
 * Turns an access token handed back by the OAuth flow into a stored session.
 *
 * Lives outside the Accounts page because the token arrives whenever the
 * provider redirects back, which may be onto a different screen — or, on
 * Android, into a process that has only just started.
 */
export async function completeLichessLogin(token: string): Promise<void> {
    const alias = localStorage.getItem(LICHESS_ALIAS_KEY) ?? "";
    localStorage.removeItem(LICHESS_ALIAS_KEY);

    const account = await getLichessAccount({ token });
    if (!account) return;

    getDefaultStore().set(sessionsAtom, (sessions) => [
        ...sessions.filter((session) => session.lichess?.username !== account.username),
        {
            lichess: { accessToken: token, username: account.username, account },
            player: alias === "" ? account.username : alias,
            updatedAt: Date.now(),
        },
    ]);
}
