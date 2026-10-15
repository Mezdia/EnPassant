import { Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useContext, useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  activeTabAtom,
  currentDetachedEngineAtom,
  engineMovesFamily,
  enginesAtom,
} from "@/state/atoms";
import { getVariationLine } from "@/utils/chess";
import DetachedEval from "../common/DetachedEval";
import { TreeStateContext } from "../common/TreeStateContext";
import classes from "./MobileEngineLines.module.css";

/**
 * The mobile-only contents of the `#mobileEngineLines` region: the canonical
 * single eval strip plus a second, tappable principal-variation row under it.
 *
 * Contract v1.1 fixes the eval gauge to exactly one `DetachedEval` instance on
 * mobile — this wrapper keeps that instance as the only one while adding the
 * PV row on top of the same engine data, so no second gauge and no
 * orientation branching is introduced (the region's placement stays pure CSS).
 */
export function MobileEngineLines() {
  const detachedEngineId = useAtomValue(currentDetachedEngineAtom);
  const engines = useAtomValue(enginesAtom);
  const activeTab = useAtomValue(activeTabAtom);

  const engine = detachedEngineId ? engines?.find((e) => e.id === detachedEngineId) : undefined;

  return (
    <div className={classes.root}>
      <DetachedEval />
      {engine && activeTab ? <EnginePvRow engineId={engine.id} tab={activeTab} /> : null}
    </div>
  );
}

/**
 * Principal-variation line for the pinned engine, shown under the eval strip.
 * Collapsed to one row so the region stays cheap; a tap expands it. Reads the
 * same `engineMovesFamily` map `DetachedEval` uses — no new engine plumbing.
 */
function EnginePvRow({ engineId, tab }: { engineId: string; tab: string }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const store = useContext(TreeStateContext)!;
  const rootFen = useStore(store, (s) => s.root.fen);
  const moves = useStore(
    store,
    useShallow((s) => getVariationLine(s.root, s.position)),
  );

  const ev = useAtomValue(engineMovesFamily({ engine: engineId, tab }));

  const topLine = useDeferredValue(
    useMemo(() => {
      const variations = ev?.get(`${rootFen}:${moves.join(",")}`);
      return variations && variations.length > 0 ? variations[0] : null;
    }, [ev, rootFen, moves]),
  );

  // The strip above already covers no-engine / searching / game-over states;
  // this row only adds depth when a full PV exists.
  if (!topLine || topLine.sanMoves.length === 0) return null;

  const shown = expanded ? topLine.sanMoves.slice(0, 24) : topLine.sanMoves.slice(0, 8);

  return (
    <button
      type="button"
      className={classes.pv}
      onClick={() => setExpanded((v) => !v)}
      aria-label={t("Board.Mobile.PvLine")}
      aria-expanded={expanded}
    >
      <Text
        component="span"
        fz="xs"
        c="dimmed"
        className={expanded ? classes.pvExpanded : classes.pvCollapsed}
      >
        {shown.join(" ")}
      </Text>
    </button>
  );
}

export default MobileEngineLines;
