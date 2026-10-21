import { key2pos } from './util.js';
import { sameEndpoints, sameColor, } from './draw.js';
export { createElement, setAttributes };
export function createDefs() {
    const defs = createElement('defs');
    const filter = setAttributes(createElement('filter'), { id: 'cg-filter-blur' });
    filter.appendChild(setAttributes(createElement('feGaussianBlur'), { stdDeviation: '0.013' }));
    defs.appendChild(filter);
    return defs;
}
export function renderSvg(state, els) {
    const d = state.drawable, curD = d.current, cur = curD && curD.mouseSq ? curD : undefined, dests = new Map(), bounds = state.dom.bounds(), nonPieceAutoShapes = d.autoShapes.filter(autoShape => !autoShape.piece);
    for (const s of d.shapes.concat(nonPieceAutoShapes).concat(cur ? [cur] : [])) {
        if (!s.dest)
            continue;
        const sources = dests.get(s.dest) ?? new Set(), from = pos2user(orient(key2pos(s.orig), state.orientation), bounds), to = pos2user(orient(key2pos(s.dest), state.orientation), bounds);
        sources.add(angleToSlot(moveAngle(from, to)));
        dests.set(s.dest, sources);
    }
    const shapes = [];
    const pendingEraseIdx = cur ? d.shapes.findIndex(s => sameEndpoints(s, cur) && sameColor(s, cur)) : -1;
    for (const [idx, s] of d.shapes.concat(nonPieceAutoShapes).entries()) {
        const isPendingErase = pendingEraseIdx !== -1 && pendingEraseIdx === idx;
        shapes.push({
            shape: s,
            current: false,
            pendingErase: isPendingErase,
            hash: shapeHash(s, isShort(s.dest, dests), false, bounds, isPendingErase, angleCount(s.dest, dests)),
        });
    }
    if (cur && pendingEraseIdx === -1)
        shapes.push({
            shape: cur,
            current: true,
            hash: shapeHash(cur, isShort(cur.dest, dests), true, bounds, false, angleCount(cur.dest, dests)),
            pendingErase: false,
        });
    const fullHash = shapes.map(sc => sc.hash).join(';');
    if (fullHash === state.drawable.prevSvgHash)
        return;
    state.drawable.prevSvgHash = fullHash;
    syncDefs(d, shapes, els);
    syncShapes(shapes, els, s => renderShape(state, s, d.brushes, dests, bounds));
}
// append only. Don't try to update/remove.
function syncDefs(d, shapes, els) {
    for (const shapesEl of [els.shapes, els.shapesBelow]) {
        const defsEl = shapesEl.querySelector('defs');
        const thisPlane = shapes.filter(s => (shapesEl === els.shapesBelow) === !!s.shape.below);
        const brushes = new Map();
        for (const s of thisPlane.filter(s => s.shape.dest && s.shape.brush)) {
            const brush = makeCustomBrush(d.brushes[s.shape.brush], s.shape.modifiers);
            const { key, color } = hiliteOf(s.shape);
            if (key && color)
                brushes.set(key, { key, color, opacity: 1, lineWidth: 1 });
            brushes.set(brush.key, brush);
        }
        const keysInDom = new Set();
        let el = defsEl.firstElementChild;
        while (el) {
            keysInDom.add(el.getAttribute('cgKey'));
            el = el.nextElementSibling;
        }
        for (const [key, brush] of brushes.entries()) {
            if (!keysInDom.has(key))
                defsEl.appendChild(renderMarker(brush));
        }
    }
}
function syncShapes(shapes, els, renderShape) {
    for (const [shapesEl, customEl] of [
        [els.shapes, els.custom],
        [els.shapesBelow, els.customBelow],
    ]) {
        const [shapesG, customG] = [shapesEl, customEl].map(el => el.querySelector('g'));
        const thisPlane = shapes.filter(s => (shapesEl === els.shapesBelow) === !!s.shape.below);
        const hashesInDom = new Map();
        for (const sc of thisPlane)
            hashesInDom.set(sc.hash, false);
        for (const root of [shapesG, customG]) {
            const toRemove = [];
            let el = root.firstElementChild, elHash;
            while (el) {
                elHash = el.getAttribute('cgHash');
                if (hashesInDom.has(elHash))
                    hashesInDom.set(elHash, true);
                else
                    toRemove.push(el);
                el = el.nextElementSibling;
            }
            for (const el of toRemove)
                root.removeChild(el);
        }
        // insert shapes that are not yet in dom
        for (const sc of thisPlane.filter(s => !hashesInDom.get(s.hash))) {
            for (const svg of renderShape(sc)) {
                if (svg.isCustom)
                    customG.appendChild(svg.el);
                else
                    shapesG.appendChild(svg.el);
            }
        }
    }
}
function shapeHash({ orig, dest, brush, piece, modifiers, customSvg, label, below }, shorten, current, bounds, pendingErase, angleCountOfDest) {
    // a shape and an overlay svg share a lifetime and have the same cgHash attribute
    return [
        bounds.width,
        bounds.height,
        current,
        pendingErase && 'pendingErase',
        angleCountOfDest,
        orig,
        dest,
        brush,
        shorten && '-',
        piece && pieceHash(piece),
        modifiers && modifiersHash(modifiers),
        customSvg && `custom-${textHash(customSvg.html)},${customSvg.center?.[0] ?? 'o'}`,
        label && `label-${textHash(label.text)}`,
        below && 'below',
    ]
        .filter(x => x)
        .join(',');
}
const pieceHash = (piece) => [piece.color, piece.role, piece.scale].filter(x => x).join(',');
const modifiersHash = (m) => [m.lineWidth, m.hilite].filter(x => x).join(',');
function textHash(s) {
    // Rolling hash with base 31 (cf. https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript)
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) >>> 0;
    }
    return h.toString();
}
function renderShape(state, { shape, current, pendingErase, hash }, brushes, dests, bounds) {
    const from = pos2user(orient(key2pos(shape.orig), state.orientation), bounds), to = shape.dest ? pos2user(orient(key2pos(shape.dest), state.orientation), bounds) : from, brush = shape.brush && makeCustomBrush(brushes[shape.brush], shape.modifiers), slots = dests.get(shape.dest), svgs = [];
    if (brush) {
        const el = setAttributes(createElement('g'), { cgHash: hash });
        svgs.push({ el });
        if (from[0] !== to[0] || from[1] !== to[1])
            el.appendChild(renderArrow(shape, brush, from, to, current, isShort(shape.dest, dests), pendingErase));
        else
            el.appendChild(renderCircle(brushes[shape.brush], from, current, bounds, pendingErase));
    }
    if (shape.label) {
        const label = shape.label;
        label.fill ?? (label.fill = shape.brush && brushes[shape.brush].color);
        const corner = shape.brush ? undefined : 'tr';
        svgs.push({ el: renderLabel(label, hash, from, to, slots, corner), isCustom: true });
    }
    if (shape.customSvg) {
        const on = shape.customSvg.center ?? 'orig';
        const [x, y] = on === 'label' ? labelCoords(from, to, slots).map(c => c - 0.5) : on === 'dest' ? to : from;
        const el = setAttributes(createElement('g'), { transform: `translate(${x},${y})`, cgHash: hash });
        el.innerHTML = `<svg width="1" height="1" viewBox="0 0 100 100">${shape.customSvg.html}</svg>`;
        svgs.push({ el, isCustom: true });
    }
    return svgs;
}
function renderCircle(brush, at, current, bounds, pendingErase) {
    const widths = circleWidth(), radius = (bounds.width + bounds.height) / (4 * Math.max(bounds.width, bounds.height));
    return setAttributes(createElement('circle'), {
        stroke: brush.color,
        'stroke-width': widths[current ? 0 : 1],
        fill: 'none',
        opacity: opacity(brush, current, pendingErase),
        cx: at[0],
        cy: at[1],
        r: radius - widths[1] / 2,
    });
}
function renderArrow(s, brush, from, to, current, shorten, pendingErase) {
    function renderLine(isHilite) {
        const m = arrowMargin(shorten && !current), dx = to[0] - from[0], dy = to[1] - from[1], angle = Math.atan2(dy, dx), xo = Math.cos(angle) * m, yo = Math.sin(angle) * m;
        const hilite = hiliteOf(s);
        return setAttributes(createElement('line'), {
            stroke: isHilite ? hilite.color : brush.color,
            'stroke-width': lineWidth(brush, current) * (isHilite ? 1.14 : 1),
            'stroke-linecap': 'round',
            'marker-end': `url(#arrowhead-${isHilite ? hilite.key : brush.key})`,
            opacity: s.modifiers?.hilite && !pendingErase ? 1 : opacity(brush, current, pendingErase),
            x1: from[0],
            y1: from[1],
            x2: to[0] - xo,
            y2: to[1] - yo,
        });
    }
    if (!s.modifiers?.hilite)
        return renderLine(false);
    const g = setAttributes(createElement('g'), { opacity: brush.opacity });
    const blurred = setAttributes(createElement('g'), { filter: 'url(#cg-filter-blur)' });
    blurred.appendChild(filterBox(from, to));
    blurred.appendChild(renderLine(true));
    g.appendChild(blurred);
    g.appendChild(renderLine(false));
    return g;
}
function renderMarker(brush) {
    const marker = setAttributes(createElement('marker'), {
        id: 'arrowhead-' + brush.key,
        orient: 'auto',
        overflow: 'visible',
        markerWidth: 4,
        markerHeight: 4,
        refX: brush.key.startsWith('hilite') ? 1.86 : 2.05,
        refY: 2,
    });
    marker.appendChild(setAttributes(createElement('path'), {
        d: 'M0,0 V4 L3,2 Z',
        fill: brush.color,
    }));
    marker.setAttribute('cgKey', brush.key);
    return marker;
}
function renderLabel(label, hash, from, to, slots, corner) {
    const labelSize = 0.4, fontSize = labelSize * 0.75 ** label.text.length, at = labelCoords(from, to, slots), cornerOff = corner === 'tr' ? 0.4 : 0, g = setAttributes(createElement('g'), {
        transform: `translate(${at[0] + cornerOff},${at[1] - cornerOff})`,
        cgHash: hash,
    });
    g.appendChild(setAttributes(createElement('circle'), {
        r: labelSize / 2,
        'fill-opacity': corner ? 1.0 : 0.8,
        'stroke-opacity': corner ? 1.0 : 0.7,
        'stroke-width': 0.03,
        fill: label.fill ?? '#666',
        stroke: 'white',
    }));
    const labelEl = setAttributes(createElement('text'), {
        'font-size': fontSize,
        'font-family': 'Noto Sans',
        'text-anchor': 'middle',
        fill: 'white',
        y: 0.13 * 0.75 ** label.text.length,
    });
    labelEl.innerHTML = label.text;
    g.appendChild(labelEl);
    return g;
}
const orient = (pos, color) => (color === 'white' ? pos : [7 - pos[0], 7 - pos[1]]);
const mod = (n, m) => ((n % m) + m) % m;
const rotateAngleSlot = (slot, steps) => mod(slot + steps, 16);
const anyTwoCloserThan90Degrees = (slots) => [...slots].some(slot => [-3, -2, -1, 1, 2, 3].some(i => slots.has(rotateAngleSlot(slot, i))));
const isShort = (dest, dests) => !!dest && dests.has(dest) && anyTwoCloserThan90Degrees(dests.get(dest));
const createElement = (tagName) => document.createElementNS('http://www.w3.org/2000/svg', tagName);
const angleCount = (dest, dests) => dest && dests.has(dest) ? dests.get(dest).size : 0;
function setAttributes(el, attrs) {
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key))
            el.setAttribute(key, attrs[key]);
    }
    return el;
}
const makeCustomBrush = (base, modifiers) => !modifiers
    ? base
    : {
        color: base.color,
        opacity: Math.round(base.opacity * 10) / 10,
        lineWidth: Math.round(modifiers.lineWidth || base.lineWidth),
        key: [base.key, modifiers.lineWidth].filter(x => x).join(''),
    };
const circleWidth = () => [3 / 64, 4 / 64];
const lineWidth = (brush, current) => ((brush.lineWidth || 10) * (current ? 0.85 : 1)) / 64;
function hiliteOf(shape) {
    const hilite = shape.modifiers?.hilite;
    return { key: hilite && `hilite-${hilite.replace('#', '')}`, color: hilite };
}
const opacity = (brush, current, pendingErase) => (brush.opacity || 1) * (pendingErase ? 0.6 : current ? 0.9 : 1);
const arrowMargin = (shorten) => (shorten ? 20 : 10) / 64;
function pos2user(pos, bounds) {
    const xScale = Math.min(1, bounds.width / bounds.height);
    const yScale = Math.min(1, bounds.height / bounds.width);
    return [(pos[0] - 3.5) * xScale, (3.5 - pos[1]) * yScale];
}
function filterBox(from, to) {
    // lines/arrows are considered to be one dimensional for the purposes of SVG filters,
    // so we add a transparent bounding box to ensure they apply to the 2nd dimension
    const box = {
        from: [Math.floor(Math.min(from[0], to[0])), Math.floor(Math.min(from[1], to[1]))],
        to: [Math.ceil(Math.max(from[0], to[0])), Math.ceil(Math.max(from[1], to[1]))],
    };
    return setAttributes(createElement('rect'), {
        x: box.from[0],
        y: box.from[1],
        width: box.to[0] - box.from[0],
        height: box.to[1] - box.from[1],
        fill: 'none',
        stroke: 'none',
    });
}
const angleToSlot = (angle) => mod(Math.round((angle * 8) / Math.PI), 16);
const moveAngle = (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]) + Math.PI;
const dist = (from, to) => Math.sqrt([from[0] - to[0], from[1] - to[1]].reduce((acc, x) => acc + x * x, 0));
/*
 try to place label at the junction of the destination shaft and arrowhead. if there's more than
 1 arrow pointing to a square, the arrow shortens by 10 / 64 units so the label must move as well.

 if the angle between two incoming arrows is pi / 8, such as when an adjacent knight and bishop
 attack the same square, the knight's label is slid further down the shaft by an amount equal to
 our label size to avoid collision
*/
function labelCoords(from, to, slots) {
    let mag = dist(from, to);
    //if (mag === 0) return [from[0], from[1]];
    const angle = moveAngle(from, to);
    if (slots) {
        mag -= 33 / 64; // reduce by arrowhead length
        if (anyTwoCloserThan90Degrees(slots)) {
            mag -= 10 / 64; // reduce by shortening factor
            const slot = angleToSlot(angle);
            // reduce by label size for the knight if another arrow is within pi / 8:
            if (slot & 1 && [-1, 1].some(s => slots.has(rotateAngleSlot(slot, s))))
                mag -= 0.4;
        }
    }
    return [from[0] - Math.cos(angle) * mag, from[1] - Math.sin(angle) * mag].map(c => c + 0.5);
}
//# sourceMappingURL=svg.js.map