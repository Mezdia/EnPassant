require('../fetchUtils-umV5xXBy.cjs');
require('../bufferUtils-S5_-2eN4.cjs');
const require_ClientRequest = require('../ClientRequest-2loAH7xM.cjs');
require('../handleRequest-C-cKYjIh.cjs');
require('../node-DIKcnzhK.cjs');
const require_XMLHttpRequest = require('../XMLHttpRequest-BtDNZipW.cjs');
require('../hasConfigurableGlobal-MjY06_Ok.cjs');
const require_fetch = require('../fetch-D2ClLNN-.cjs');

//#region src/presets/node.ts
/**
* The default preset provisions the interception of requests
* regardless of their type (http/https/XMLHttpRequest).
*/
var node_default = [
	new require_ClientRequest.ClientRequestInterceptor(),
	new require_XMLHttpRequest.XMLHttpRequestInterceptor(),
	new require_fetch.FetchInterceptor()
];

//#endregion
module.exports = node_default;
//# sourceMappingURL=node.cjs.map