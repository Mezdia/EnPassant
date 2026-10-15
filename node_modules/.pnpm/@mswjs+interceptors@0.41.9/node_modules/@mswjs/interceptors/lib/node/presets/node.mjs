import "../fetchUtils-BKJ1XmiO.mjs";
import "../bufferUtils-DxPxwff_.mjs";
import { t as ClientRequestInterceptor } from "../ClientRequest-DGhBX21V.mjs";
import "../handleRequest-FIQv5pwH.mjs";
import "../node-lsdNwZEW.mjs";
import { t as XMLHttpRequestInterceptor } from "../XMLHttpRequest-Dw6Wm-UU.mjs";
import "../hasConfigurableGlobal-BiTmog1u.mjs";
import { t as FetchInterceptor } from "../fetch-CaC3rGEu.mjs";

//#region src/presets/node.ts
/**
* The default preset provisions the interception of requests
* regardless of their type (http/https/XMLHttpRequest).
*/
var node_default = [
	new ClientRequestInterceptor(),
	new XMLHttpRequestInterceptor(),
	new FetchInterceptor()
];

//#endregion
export { node_default as default };
//# sourceMappingURL=node.mjs.map