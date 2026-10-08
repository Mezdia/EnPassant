"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var observe_response_body_stream_exports = {};
__export(observe_response_body_stream_exports, {
  observeResponseBodyStream: () => observeResponseBodyStream
});
module.exports = __toCommonJS(observe_response_body_stream_exports);
var import_deferred_promise = require("@open-draft/deferred-promise");
var import_interceptors = require("@mswjs/interceptors");
var import_decorators = require("../HttpResponse/decorators");
function observeResponseBodyStream(response) {
  if (response.body == null || response.bodyUsed || response.body.locked) {
    return null;
  }
  const settled = new import_deferred_promise.DeferredPromise();
  const reader = response.body.getReader();
  const observedStream = new ReadableStream({
    async pull(controller) {
      try {
        const readResult = await reader.read();
        if (readResult.done) {
          settled.resolve();
          controller.close();
          return;
        }
        controller.enqueue(readResult.value);
      } catch (error) {
        settled.resolve();
        throw error;
      }
    },
    async cancel(reason) {
      settled.resolve();
      await reader.cancel(reason);
    }
  });
  const observedResponse = new import_interceptors.FetchResponse(observedStream, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
  (0, import_decorators.copyResponseOwnProperties)(response, observedResponse);
  return {
    response: observedResponse,
    settled
  };
}
//# sourceMappingURL=observe-response-body-stream.js.map