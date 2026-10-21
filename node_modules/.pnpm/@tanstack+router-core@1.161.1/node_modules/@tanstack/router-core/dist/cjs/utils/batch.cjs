"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const store = require("@tanstack/store");
const isServer = require("@tanstack/router-core/isServer");
function batch(fn) {
  if (isServer.isServer) {
    return fn();
  }
  let result;
  store.batch(() => {
    result = fn();
  });
  return result;
}
exports.batch = batch;
//# sourceMappingURL=batch.cjs.map
