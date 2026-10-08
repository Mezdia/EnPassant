import { parse } from "@babel/parser";
import _generate from "@babel/generator";
import * as t from "@babel/types";
import { deadCodeElimination as deadCodeElimination$1 } from "babel-dead-code-elimination";
import { findReferencedIdentifiers } from "babel-dead-code-elimination";
function parseAst({ code, ...opts }) {
  return parse(code, {
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
    if (t.isExportNamedDeclaration(node)) {
      if (node.exportKind === "type") {
        return false;
      }
      if (node.specifiers.length > 0) {
        node.specifiers = node.specifiers.filter((specifier) => {
          if (t.isExportSpecifier(specifier)) {
            return specifier.exportKind !== "type";
          }
          return true;
        });
        if (node.specifiers.length === 0 && !node.declaration) {
          return false;
        }
      }
    }
    if (t.isExportAllDeclaration(node)) {
      if (node.exportKind === "type") {
        return false;
      }
    }
    if (t.isImportDeclaration(node)) {
      if (node.importKind === "type") {
        return false;
      }
      if (node.specifiers.length > 0) {
        node.specifiers = node.specifiers.filter((specifier) => {
          if (t.isImportSpecifier(specifier)) {
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
  deadCodeElimination$1(ast, candidates);
}
export {
  deadCodeElimination,
  findReferencedIdentifiers,
  generateFromAst,
  parseAst,
  stripTypeExports
};
//# sourceMappingURL=ast.js.map
