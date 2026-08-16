/**
 * Demo autoplay: a scripted, human-looking walkthrough of the real UI.
 *
 * Every step drives the same DOM events a real user would trigger (clicks,
 * typing, square clicks) — nothing bypasses the app. The first trusted
 * pointer/click anywhere aborts the remaining steps and hands control to the
 * visitor.
 */

export type AutoplayContext = {
    /** Name of the randomly loaded fixture file. */
    file: string;
    /** SANs of the mainline, in order (from the parsed tree). */
    moves: string[];
};

export type AutoplayOptions = {
    enabled: boolean;
    context: AutoplayContext;
};

type Step = {
    name: string;
    run: (ctx: AutoplayContext) => Promise<void>;
    pauseAfterMs: number;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function waitFor(
    predicate: () => boolean | Promise<boolean>,
    timeoutMs = 10000,
    intervalMs = 120,
): Promise<void> {
    const startedAt = Date.now();
    return new Promise((resolve, reject) => {
        const tick = async () => {
            try {
                if (await predicate()) {
                    resolve();
                    return;
                }
            } catch {
                // keep polling
            }
            if (Date.now() - startedAt > timeoutMs) {
                reject(new Error(`waitFor timed out after ${timeoutMs}ms`));
                return;
            }
            setTimeout(tick, intervalMs);
        };
        void tick();
    });
}

function findClickable(text: string, root: ParentNode = document): HTMLElement | null {
    const candidates = root.querySelectorAll<HTMLElement>(
        "button, a, [role='button'], [role='tab'], [role='radio'], [role='switch'], label, .mantine-UnstyledButton-root, [tabindex]",
    );
    for (const el of candidates) {
        const own = (el.textContent ?? "").trim();
        if (own === text) return el;
    }
    for (const el of candidates) {
        const own = (el.textContent ?? "").trim();
        if (own.includes(text)) return el;
    }
    return null;
}

function clickElement(el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const options: MouseEventInit = {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        view: window,
    };
    el.dispatchEvent(
        new PointerEvent("pointerdown", {
            ...options,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
            button: 0,
        }),
    );
    el.dispatchEvent(
        new PointerEvent("pointerup", {
            ...options,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
            button: 0,
        }),
    );
    el.dispatchEvent(new MouseEvent("click", { ...options, detail: 1, button: 0 }));
}

function clickSelector(selector: string): boolean {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return false;
    clickElement(el);
    return true;
}

function clickText(text: string, root: ParentNode = document): boolean {
    const el = findClickable(text, root);
    if (!el) return false;
    clickElement(el);
    return true;
}

/** Click the n-th mainline move by its SAN text (robust against variations). */
function clickMainlineMove(ctx: AutoplayContext, index: number): boolean {
    const san = ctx.moves[index];
    if (!san) return false;
    const cells = [...document.querySelectorAll<HTMLElement>("button")].filter(
        (b) => (b.textContent ?? "").trim() === san,
    );
    const cell = cells[0];
    if (!cell) return false;
    clickElement(cell);
    return true;
}

function reportHeight(): void {
    if (window === window.parent) return;
    const height = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
    );
    window.parent.postMessage({ source: "enpassant-demo", type: "resize", height }, "*");
}

async function runStep(
    step: Step,
    ctx: AutoplayContext,
    signal: { cancelled: boolean },
): Promise<void> {
    if (signal.cancelled) return;
    await step.run(ctx);
    if (signal.cancelled) return;
    const waitedFor = Date.now();
    while (Date.now() - waitedFor < step.pauseAfterMs) {
        if (signal.cancelled) return;
        if (document.hidden) {
            await sleep(250);
            continue;
        }
        await sleep(100);
    }
    reportHeight();
}

/** The analysis tab's engine row: the shared container of the controls. */
function findEngineRow(): HTMLElement | null {
    const textEl = [...document.querySelectorAll<HTMLElement>("*")].find(
        (el) => (el.textContent ?? "").trim() === "Lichess Cloud Eval",
    );
    if (!textEl) return null;
    let container: HTMLElement | null = textEl;
    while (
        container &&
        container.querySelectorAll("button").length === 0 &&
        container !== document.body
    ) {
        container = container.parentElement;
    }
    return container && container.querySelectorAll("button").length > 0 ? container : null;
}

/** Compute a plausible "exploratory" move at the given ply for the board click-through. */

function buildScenario(): Step[] {
    return [
        {
            name: "Wait for the analysis board",
            run: async ({ moves }) => {
                await waitFor(() => document.querySelector("cg-container") !== null, 20000);
                const firstSan = moves[Math.min(3, moves.length - 1)];
                await waitFor(
                    () =>
                        firstSan !== undefined &&
                        [...document.querySelectorAll("button")].some(
                            (b) => (b.textContent ?? "").trim() === firstSan,
                        ),
                    15000,
                );
            },
            pauseAfterMs: 1500,
        },
        {
            name: "Review the opening moves",
            run: async (ctx) => {
                const clicks = [
                    Math.min(2, ctx.moves.length - 1),
                    Math.min(4, ctx.moves.length - 1),
                    Math.min(6, ctx.moves.length - 1),
                ];
                for (const i of clicks) {
                    if (!clickMainlineMove(ctx, i)) break;
                    await sleep(950);
                }
            },
            pauseAfterMs: 1200,
        },
        {
            name: "Watch the pieces move through the middlegame",
            run: async (ctx) => {
                const clicks = [
                    Math.min(8, ctx.moves.length - 1),
                    Math.min(10, ctx.moves.length - 1),
                    Math.min(13, ctx.moves.length - 1),
                    Math.min(16, ctx.moves.length - 1),
                ];
                for (const i of clicks) {
                    if (!clickMainlineMove(ctx, i)) break;
                    await sleep(1000);
                }
            },
            pauseAfterMs: 1200,
        },
        {
            name: "Jump to the final position",
            run: async (ctx) => {
                if (clickMainlineMove(ctx, ctx.moves.length - 1)) {
                    await sleep(1200);
                }
            },
            pauseAfterMs: 900,
        },
        {
            name: "Scrub back to the critical moment",
            run: async (ctx) => {
                const i = Math.min(4, ctx.moves.length - 1);
                if (clickMainlineMove(ctx, i)) {
                    await sleep(1000);
                }
            },
            pauseAfterMs: 700,
        },
        {
            name: "Open the Analysis tab",
            run: async () => {
                if (clickText("Analysis")) {
                    await sleep(900);
                }
            },
            pauseAfterMs: 500,
        },
        {
            name: "Turn the cloud engine on",
            run: async () => {
                const row = findEngineRow();
                const toggle = row?.querySelector("button");
                if (!toggle) {
                    return;
                }
                clickElement(toggle);
                await sleep(600);
            },
            pauseAfterMs: 4200,
        },
        {
            name: "Review the engine line",
            run: async () => {
                const row = findEngineRow();
                const header = row?.querySelector<HTMLElement>(
                    '[class*="accordionControl"], [class*="Accordion-control"], [class*="accordion-control"]',
                );
                if (header) {
                    clickElement(header);
                    await sleep(1000);
                    clickElement(header);
                    await sleep(800);
                }
            },
            pauseAfterMs: 1500,
        },
        {
            name: "Show more engine lines",
            run: async () => {
                const row = findEngineRow();
                const settingsButton = row?.querySelectorAll("button")[3];
                if (!settingsButton) {
                    return;
                }
                clickElement(settingsButton);
                await sleep(700);
                if (clickText("3")) {
                    await sleep(3500);
                }
            },
            pauseAfterMs: 1200,
        },
        {
            name: "Dial the lines back down",
            run: async () => {
                if (clickText("1")) {
                    await sleep(2500);
                }
            },
            pauseAfterMs: 900,
        },
        {
            name: "Browse the game info",
            run: async () => {
                clickText("Info");
                await sleep(1600);
            },
            pauseAfterMs: 800,
        },
        {
            name: "Browse annotations",
            run: async () => {
                clickText("Annotate");
                await sleep(1300);
            },
            pauseAfterMs: 700,
        },
        {
            name: "Open the Files screen",
            run: async (_ctx) => {
                if (!clickSelector('a[href$="/files"]')) {
                    throw new Error("Files nav link not found");
                }
                await waitFor(
                    () => (document.body.textContent ?? "").includes("Morphy-Opera-Game"),
                    10000,
                );
            },
            pauseAfterMs: 1800,
        },
        {
            name: "Open a different game from the file list",
            run: async (ctx) => {
                const targets = [
                    "Immortal-Game",
                    "Morphy-Opera-Game",
                    "Game-of-the-Century",
                ].filter((name) => !ctx.file.startsWith(name));
                let clicked = false;
                for (const target of targets) {
                    if (clickText(target)) {
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) {
                    return;
                }
                await waitFor(() => document.querySelector("cg-container") !== null, 15000);
            },
            pauseAfterMs: 2600,
        },
        {
            name: "Open Settings",
            run: async () => {
                if (!clickSelector('a[href$="/settings"]')) {
                    throw new Error("Settings nav link not found");
                }
                await waitFor(
                    () =>
                        (document.body.textContent ?? "").includes("Board") &&
                        (document.body.textContent ?? "").includes("Keybind"),
                    10000,
                ).catch(() => undefined);
            },
            pauseAfterMs: 2200,
        },
        {
            name: "Back to the board",
            run: async () => {
                clickSelector('a[href$="/"]');
            },
            pauseAfterMs: 1500,
        },
    ];
}

export function startAutoplay(options: AutoplayOptions): { stop: () => void } {
    const signal = { cancelled: false };
    const steps = buildScenario();

    if (!options.enabled) {
        return { stop: () => undefined };
    }

    const stop = () => {
        signal.cancelled = true;
    };

    const onTrustedInput = (event: Event) => {
        if (event.isTrusted) {
            stop();
            window.parent.postMessage({ source: "enpassant-demo", type: "handoff" }, "*");
        }
    };

    document.addEventListener("pointerdown", onTrustedInput, true);
    document.addEventListener("click", onTrustedInput, true);

    const run = async () => {
        try {
            await waitFor(
                () => document.visibilityState === "visible" && document.body !== null,
                15000,
            );
            for (const step of steps) {
                if (signal.cancelled) return;
                if (document.hidden) {
                    await waitFor(() => document.visibilityState === "visible", 120000);
                }
                try {
                    await runStep(step, options.context, signal);
                } catch (error) {
                    console.warn(`[demo] autoplay step "${step.name}" skipped:`, error);
                    reportHeight();
                }
            }
        } finally {
            stop();
            document.removeEventListener("pointerdown", onTrustedInput, true);
            document.removeEventListener("click", onTrustedInput, true);
        }
    };

    window.setTimeout(() => void run(), 800);

    return { stop };
}

export function installResizeReporter(): void {
    if (window === window.parent) return;

    const report = () => reportHeight();
    let scheduled = false;
    const observer = new ResizeObserver(() => {
        if (scheduled) return;
        scheduled = true;
        window.setTimeout(() => {
            scheduled = false;
            report();
        }, 150);
    });
    observer.observe(document.body);
    window.addEventListener("load", report);
    window.setTimeout(report, 1000);
    window.setInterval(report, 5000);
}
