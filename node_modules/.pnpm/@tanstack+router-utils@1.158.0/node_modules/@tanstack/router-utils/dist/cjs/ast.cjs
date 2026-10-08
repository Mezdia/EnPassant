"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const parser = require("@babel/parser");
const _generate = require("@babel/generator");
const t = require("@babel/types");
const babelDeadCodeElimination = require("babel-dead-code-elimination");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const t__namespace = /* @__PURE__ */ _interopNamespaceDefault(t);
function parseAst({ code, ...opts }) {
  return parser.parse(code, {
    plugins: ["jsx", "typescript", "explicitResourceManagement"],
    sourceType: "module",
    ...opts
  });
}
let generate = _generate;
if ("default" in generate) {
  generate = generate.default;
}
function generateFromAst(ast, opts) {
  return generate(
    ast,
    opts ? { importAttributesKeyword: "with", sourceMaps: true, ...opts } : void 0
  );
}
function stripTypeExports(ast) {
  ast.program.body = ast.program.body.filter((node) => {
    if (t__namespace.isExportNamedDeclaration(node)) {
      if (node.exportKind === "type") {
        return false;
      }
      if (node.specifiers.length > 0) {
        node.specifiers = node.specifiers.filter((specifier) => {
          if (t__namespace.isExportSpecifier(specifier)) {
            return specifier.exportKind !== "type";
          }
          return true;
        });
        if (node.specifiers.length === 0 && !node.declaration) {
          return false;
        }
      }
    }
    if (t__namespace.isExportAllDeclaration(node)) {
      if (node.exportKind === "type") {
        return false;
      }
    }
    if (t__namespace.isImportDeclaration(node)) {
      if (node.importKind === "type") {
        return false;
      }
      if (node.specifiers.length > 0) {
        node.specifiers = node.specifiers.filter((specifier) => {
          if (t__namespace.isImportSpecifier(specifier)) {
            return specifier.importKind !== "type";
          }
          return true;
        });
        if (node.specifiers.length === 0) {
          return false;
        }
      }
    }
    return true;
  });
}
function deadCodeElimination(ast, candidates) {
  stripTypeExports(ast);
  babelDeadCodeElimination.deadCodeElimination(ast, candidates);
}
Object.defineProperty(exports, "findReferencedIdentifiers", {
  enumerable: true,
  get: () => babelDeadCodeElimination.findReferencedIdentifiers
});
exports.deadCodeElimination = deadCodeElimination;
exports.generateFromAst = generateFromAst;
exports.parseAst = parseAst;
exports.stripTypeExports = stripTypeExports;
//# sourceMappingURL=ast.cjs.map
