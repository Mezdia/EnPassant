"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const ast = require("./ast.cjs");
const logger = require("./logger.cjs");
const copyFilesPlugin = require("./copy-files-plugin.cjs");
const babelDeadCodeElimination = require("babel-dead-code-elimination");
exports.deadCodeElimination = ast.deadCodeElimination;
exports.generateFromAst = ast.generateFromAst;
exports.parseAst = ast.parseAst;
exports.stripTypeExports = ast.stripTypeExports;
exports.logDiff = logger.logDiff;
exports.copyFilesPlugin = copyFilesPlugin.copyFilesPlugin;
Object.defineProperty(exports, "findReferencedIdentifiers", {
  enumerable: true,
  get: () => babelDeadCodeElimination.findReferencedIdentifiers
});
//# sourceMappingURL=index.cjs.map
