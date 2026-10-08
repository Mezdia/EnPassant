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
var Disposable_exports = {};
__export(Disposable_exports, {
  Disposable: () => Disposable
});
module.exports = __toCommonJS(Disposable_exports);
var import_devUtils = require("./devUtils");
class Disposable {
  subscriptions = [];
  dispose() {
    let subscription;
    const errors = [];
    while (subscription = this.subscriptions.shift()) {
      try {
        subscription();
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error);
        }
      }
    }
    if (errors.length > 0) {
      console.error(
        new AggregateError(
          errors,
          import_devUtils.devUtils.formatMessage(
            "Failed to dispose of some side effects. This is likely an issue with MSW, please report it on GitHub: https://github.com/mswjs/msw/issues"
          )
        )
      );
    }
  }
}
//# sourceMappingURL=Disposable.js.map