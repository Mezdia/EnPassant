import * as cg from './types.js';
export const invRanks = [...cg.ranks].reverse();
export const allKeys = cg.files.flatMap(f => cg.ranks.map(r => (f + r)));
export const pos2key = (pos) => pos.every(x => x >= 0 && x <= 7) ? allKeys[8 * pos[0] + pos[1]] : undefined;
export const pos2keyUnsafe = (pos) => pos2key(pos);
export const key2pos = (k) => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];
export const uciToMove = (uci) => {
    if (!uci)
        return undefined;
    if (uci[1] === '@')
        return [uci.slice(2, 4)];
    return [uci.slice(0, 2), uci.slice(2, 4)];
};
export const allPos = allKeys.map(key2pos);
export const allPosAndKey = allKeys.map((key, i) => ({ key, pos: allPos[i] }));
export function memo(f) {
    let v;
    const ret = () => {
        if (v === undefined)
            v = f();
        return v;
    };
    ret.clear = () => {
        v = undefined;
    };
    return ret;
}
export const timer = () => {
    let startAt;
    return {
        start() {
            startAt = performance.now();
        },
        cancel() {
            startAt = undefined;
        },
        stop() {
            if (!startAt)
                return 0;
            const time = performance.now() - startAt;
            startAt = undefined;
            return time;
        },
    };
};
export const opposite = (c) => (c === 'white' ? 'black' : 'white');
export const distanceSq = (pos1, pos2) => (pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2;
export const samePiece = (p1, p2) => p1.role === p2.role && p1.color === p2.color;
export const samePos = (p1, p2) => p1[0] === p2[0] && p1[1] === p2[1];
export const posToTranslate = (bounds) => (pos, asWhite) => [
    ((asWhite ? pos[0] : 7 - pos[0]) * bounds.width) / 8,
    ((asWhite ? 7 - pos[1] : pos[1]) * bounds.height) / 8,
];
export const translate = (el, pos) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
};
export const translateAndScale = (el, pos, scale = 1) => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px) scale(${scale})`;
};
export const setVisible = (el, v) => {
    el.style.display = v ? '' : 'none';
};
export const eventPosition = (e) => {
    if (e.clientX || e.clientX === 0)
        return [e.clientX, e.clientY];
    if (e.targetTouches?.[0])
        return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return; // touchend has no position!
};
const isFireMac = memo(() => !('ontouchstart' in window) &&
    ['macintosh', 'firefox'].every(x => navigator.userAgent.toLowerCase().includes(x)));
export const isRightButton = (e) => e.button === 2 && !(e.ctrlKey && isFireMac());
export const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className)
        el.className = className;
    return el;
};
export function computeSquareCenter(key, asWhite, bounds) {
    const pos = key2pos(key);
    if (!asWhite) {
        pos[0] = 7 - pos[0];
        pos[1] = 7 - pos[1];
    }
    return [
        bounds.left + (bounds.width * pos[0]) / 8 + bounds.width / 16,
        bounds.top + (bounds.height * (7 - pos[1])) / 8 + bounds.height / 16,
    ];
}
export const diff = (a, b) => Math.abs(a - b);
export const knightDir = (x1, y1, x2, y2) => diff(x1, x2) * diff(y1, y2) === 2;
export const rookDir = (x1, y1, x2, y2) => (x1 === x2) !== (y1 === y2);
export const bishopDir = (x1, y1, x2, y2) => diff(x1, x2) === diff(y1, y2) && x1 !== x2;
export const queenDir = (x1, y1, x2, y2) => rookDir(x1, y1, x2, y2) || bishopDir(x1, y1, x2, y2);
export const kingDirNonCastling = (x1, y1, x2, y2) => Math.max(diff(x1, x2), diff(y1, y2)) === 1;
export const pawnDirCapture = (x1, y1, x2, y2, isDirectionUp) => diff(x1, x2) === 1 && y2 === y1 + (isDirectionUp ? 1 : -1);
export const pawnDirAdvance = (x1, y1, x2, y2, isDirectionUp) => {
    const step = isDirectionUp ? 1 : -1;
    return (x1 === x2 &&
        (y2 === y1 + step ||
            // allow 2 squares from first two ranks, for horde
            (y2 === y1 + 2 * step && (isDirectionUp ? y1 <= 1 : y1 >= 6))));
};
/** Returns all board squares between (x1, y1) and (x2, y2) exclusive,
 *  along a straight line (rook or bishop path). Returns [] if not aligned, or none between.
 */
export const squaresBetween = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Must be a straight or diagonal line
    if (dx && dy && Math.abs(dx) !== Math.abs(dy))
        return [];
    const stepX = Math.sign(dx), stepY = Math.sign(dy);
    const squares = [];
    let x = x1 + stepX, y = y1 + stepY;
    while (x !== x2 || y !== y2) {
        squares.push([x, y]);
        x += stepX;
        y += stepY;
    }
    return squares.map(pos2key).filter(k => k !== undefined);
};
export const adjacentSquares = (square) => {
    const pos = key2pos(square);
    const adjacentSquares = [];
    if (pos[0] > 0)
        adjacentSquares.push([pos[0] - 1, pos[1]]);
    if (pos[0] < 7)
        adjacentSquares.push([pos[0] + 1, pos[1]]);
    return adjacentSquares.map(pos2key).filter(k => k !== undefined);
};
export const squareShiftedVertically = (square, delta) => {
    const pos = key2pos(square);
    pos[1] += delta;
    return pos2key(pos);
};
//# sourceMappingURL=util.js.map