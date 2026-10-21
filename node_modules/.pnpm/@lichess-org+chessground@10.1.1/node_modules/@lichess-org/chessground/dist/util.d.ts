import * as cg from './types.js';
export declare const invRanks: readonly cg.Rank[];
export declare const allKeys: readonly cg.Key[];
export declare const pos2key: (pos: cg.Pos) => cg.Key | undefined;
export declare const pos2keyUnsafe: (pos: cg.Pos) => cg.Key;
export declare const key2pos: (k: cg.Key) => cg.Pos;
export declare const uciToMove: (uci: string | undefined) => cg.Key[] | undefined;
export declare const allPos: readonly cg.Pos[];
export declare const allPosAndKey: readonly cg.PosAndKey[];
export declare function memo<A>(f: () => A): cg.Memo<A>;
export declare const timer: () => cg.Timer;
export declare const opposite: (c: cg.Color) => cg.Color;
export declare const distanceSq: (pos1: cg.Pos, pos2: cg.Pos) => number;
export declare const samePiece: (p1: cg.Piece, p2: cg.Piece) => boolean;
export declare const samePos: (p1: cg.Pos, p2: cg.Pos) => boolean;
export declare const posToTranslate: (bounds: DOMRectReadOnly) => ((pos: cg.Pos, asWhite: boolean) => cg.NumberPair);
export declare const translate: (el: HTMLElement, pos: cg.NumberPair) => void;
export declare const translateAndScale: (el: HTMLElement, pos: cg.NumberPair, scale?: number) => void;
export declare const setVisible: (el: HTMLElement, v: boolean) => void;
export declare const eventPosition: (e: cg.MouchEvent) => cg.NumberPair | undefined;
export declare const isRightButton: (e: cg.MouchEvent) => boolean;
export declare const createEl: (tagName: string, className?: string) => HTMLElement;
export declare function computeSquareCenter(key: cg.Key, asWhite: boolean, bounds: DOMRectReadOnly): cg.NumberPair;
export declare const diff: (a: number, b: number) => number;
export declare const knightDir: cg.DirectionalCheck;
export declare const rookDir: cg.DirectionalCheck;
export declare const bishopDir: cg.DirectionalCheck;
export declare const queenDir: cg.DirectionalCheck;
export declare const kingDirNonCastling: cg.DirectionalCheck;
export declare const pawnDirCapture: (x1: number, y1: number, x2: number, y2: number, isDirectionUp: boolean) => boolean;
export declare const pawnDirAdvance: (x1: number, y1: number, x2: number, y2: number, isDirectionUp: boolean) => boolean;
/** Returns all board squares between (x1, y1) and (x2, y2) exclusive,
 *  along a straight line (rook or bishop path). Returns [] if not aligned, or none between.
 */
export declare const squaresBetween: (x1: number, y1: number, x2: number, y2: number) => cg.Key[];
export declare const adjacentSquares: (square: cg.Key) => cg.Key[];
export declare const squareShiftedVertically: (square: cg.Key, delta: number) => cg.Key | undefined;
