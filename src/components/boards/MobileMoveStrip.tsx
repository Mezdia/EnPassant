import { ScrollArea } from "@mantine/core";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";
import { TreeStateContext } from "../common/TreeStateContext";
import classes from "./MobileMoveStrip.module.css";

type Item = { san: string; halfMoves: number; path: number[] };

/**
 * The phone move list for a live game: one horizontal line of the main
 * variation above the board, the way the reference app shows it, with the move
 * on display kept in view.
 */
export function MobileMoveStrip() {
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

  return (
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
  );
}
