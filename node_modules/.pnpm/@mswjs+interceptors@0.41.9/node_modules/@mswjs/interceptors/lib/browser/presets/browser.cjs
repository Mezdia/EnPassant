require('../createRequestId-DOf8Ktjs.cjs');
require('../getRawRequest-DdfaiPVH.cjs');
require('../bufferUtils-Uc0eRItL.cjs');
require('../hasConfigurableGlobal-CS7adEvV.cjs');
require('../handleRequest-CJim54xG.cjs');
const require_fetch = require('../fetch-Bt9rMY9c.cjs');
const require_XMLHttpRequest = require('../XMLHttpRequest-gXuzzX1g.cjs');

//#region src/presets/browser.ts
/**
* The default preset provisions the interception of requests
* regardless of their type (fetch/XMLHttpRequest).
*/
var browser_default = [new require_fetch.FetchInterceptor(), new require_XMLHttpRequest.XMLHttpRequestInterceptor()];

//#endregion
module.exports = browser_default;
//# sourceMappingURL=browser.cjs.map