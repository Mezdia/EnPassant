import { ScrollArea } from "@mantine/core";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { TreeStateContext } from "../common/TreeStateContext";
import classes from "./MobileMoveStrip.module.css";

type Item = { san: string; halfMoves: number; path: number[] };

/**
 * The phone move list for a live game: one horizontal line of the main
 * variation above the board, the way the reference app shows it, with the move
 * on display kept in view.
 *
 * When the viewer has scrolled back into history, a `live` chip floats at the
 * end edge of the strip (the reference app's back-to-live affordance) and one
 * tap returns to the newest mainline move. The chip is an overlay inside the
 * strip's own box — it never changes the strip's height, so the landscape
 * board-sizing constant in the layout stays valid.
 */
export function MobileMoveStrip() {
  const { t } = useTranslation();
  const store = useContext(TreeStateContext)!;
  const root = useStore(store, (s) => s.root);
  const position = useStore(store, (s) => s.position);
  const goToMove = useStore(store, (s) => s.goToMove);

  const items = useMemo(() => {
    const out: Item[] = [];
    let node = root;
    const path: number[] = [];
    while (node.children.length > 0) {
      node = node.children[0];
      path.push(0);
      if (node.san) {
        out.push({ san: node.san, halfMoves: node.halfMoves, path: [...path] });
      }
    }
    return out;
  }, [root]);

  const currentRef = useRef<HTMLButtonElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const key = position.join(",");

  useEffect(() => {
    const el = currentRef.current;
    const box = viewport.current;
    if (!el || !box) return;
    box.scrollTo({
      left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [key]);

  if (items.length === 0) return null;

  const lastPath = items[items.length - 1].path;
  const atLive =
    position.length === lastPath.length && position.join() === lastPath.join();

  return (
    <div className={classes.wrap}>
      <ScrollArea
        type="never"
        scrollbars="x"
        viewportRef={viewport}
        className={classes.strip}
        offsetScrollbars={false}
      >
      <div className={classes.line}>
        {items.map((item) => {
          const current =
            item.path.length === position.length && item.path.join() === position.join();
          const number = Math.ceil(item.halfMoves / 2);
          return (
            <span key={item.path.join()} className={classes.pair}>
              {item.halfMoves % 2 === 1 && <span className={classes.number}>{number}.</span>}
              <button
                type="button"
                ref={current ? currentRef : undefined}
                className={current ? classes.current : classes.move}
                onClick={() => goToMove(item.path)}
              >
                {item.san}
              </button>
            </span>
          );
        })}
      </div>
      </ScrollArea>
      {!atLive && (
        <button
          type="button"
          className={classes.live}
          onClick={() => goToMove(lastPath)}
          aria-label={t("Board.Mobile.BackToLive")}
        >
          <span className={classes.liveDot} aria-hidden />
          {t("Board.Mobile.BackToLive")}
        </button>
      )}
    </div>
  );
}
