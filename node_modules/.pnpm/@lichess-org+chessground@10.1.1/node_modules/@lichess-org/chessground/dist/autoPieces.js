import { key2pos, createEl, posToTranslate as posToTranslateFromBounds, translateAndScale } from './util.js';
import { whitePov } from './board.js';
import { syncShapes } from './sync.js';
export function render(state, autoPieceEl) {
    const autoPieces = state.drawable.autoShapes.filter(autoShape => autoShape.piece);
    const autoPieceShapes = autoPieces.map((s) => {
        return {
            shape: s,
            hash: hash(s),
            current: false,
            pendingErase: false,
        };
    });
    syncShapes(autoPieceShapes, autoPieceEl, shape => renderShape(state, shape, state.dom.bounds()));
}
export function renderResized(state) {
    const asWhite = whitePov(state), posToTranslate = posToTranslateFromBounds(state.dom.bounds());
    let el = state.dom.elements.autoPieces?.firstChild;
    while (el) {
        translateAndScale(el, posToTranslate(key2pos(el.cgKey), asWhite), el.cgScale);
        el = el.nextSibling;
    }
}
function renderShape(state, { shape, hash }, bounds) {
    const orig = shape.orig;
    const role = shape.piece?.role;
    const color = shape.piece?.color;
    const scale = shape.piece?.scale;
    const pieceEl = createEl('piece', `${role} ${color}`);
    pieceEl.setAttribute('cgHash', hash);
    pieceEl.cgKey = orig;
    pieceEl.cgScale = scale;
    translateAndScale(pieceEl, posToTranslateFromBounds(bounds)(key2pos(orig), whitePov(state)), scale);
    return pieceEl;
}
const hash = (autoPiece) => [autoPiece.orig, autoPiece.piece?.role, autoPiece.piece?.color, autoPiece.piece?.scale].join(',');
//# sourceMappingURL=autoPieces.js.map