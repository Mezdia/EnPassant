import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { GameResult } from "@/bindings";
import { activeTabAtom, enginesAtom, tabEngineSettingsFamily } from "@/state/atoms";

/**
 * Fork-only mobile UI state. Kept in a separate module so the upstream atoms
 * file stays untouched and mergeable.
 */

/** Analysis screen: shrink the board so the panel area gets more room, like
 *  the reference app's state button. */
export const mobileSmallBoardAtom = atomWithStorage<boolean>("mobile-board-expanded", false);

/**
 * The outcome of the last backend game (winner + end reason), fed by the
 * game-over event in BoardGame and shown in the phone's result card. The
 * desktop stores it in the PGN headers only — the reason is not part of
 * GameHeaders, so it needs its own place.
 */
export const currentGameResultAtom = atom<GameResult | null>(null);

/**
 * True while at least one loaded engine is enabled for the active tab.
 *
 * The phone's eval gauge sits in its own 25px column beside the board, so it
 * only earns that space when an engine can fill it. `allEnabledAtom` answers a
 * different question ("is the enable-all switch on", i.e. every engine), which
 * would hide the gauge for anyone running a single engine of several.
 */
export const anyEngineEnabledAtom = atom((get) => {
    const tab = get(activeTabAtom);
    const engines = get(enginesAtom);
    if (!tab || !engines) return false;
    return engines
        .filter((engine) => engine.loaded)
        .some(
            (engine) =>
                get(
                    tabEngineSettingsFamily({
                        tab,
                        engineId: engine.id,
                        defaultSettings:
                            engine.type === "local" ? engine.settings || [] : undefined,
                        defaultGo: engine.go ?? undefined,
                    }),
                ).enabled,
        );
});
