import { State } from './state.js';
import * as cg from './types.js';
export { createElement, setAttributes };
export declare function createDefs(): Element;
export declare function renderSvg(state: State, els: cg.Elements): void;
declare const createElement: (tagName: string) => SVGElement;
declare function setAttributes(el: SVGElement, attrs: {
    [key: string]: any;
}): SVGElement;
