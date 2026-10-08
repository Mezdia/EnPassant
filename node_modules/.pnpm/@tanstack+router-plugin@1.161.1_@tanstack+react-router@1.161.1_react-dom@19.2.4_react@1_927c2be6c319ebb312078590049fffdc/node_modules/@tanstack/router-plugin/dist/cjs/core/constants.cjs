"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const tsrSplit = "tsr-split";
const tsrShared = "tsr-shared";
const splitRouteIdentNodes = [
  "loader",
  "component",
  "pendingComponent",
  "errorComponent",
  "notFoundComponent"
];
const defaultCodeSplitGroupings = [
  ["component"],
  ["errorComponent"],
  ["notFoundComponent"]
];
exports.defaultCodeSplitGroupings = defaultCodeSplitGroupings;
exports.splitRouteIdentNodes = splitRouteIdentNodes;
exports.tsrShared = tsrShared;
exports.tsrSplit = tsrSplit;
//# sourceMappingURL=constants.cjs.map
