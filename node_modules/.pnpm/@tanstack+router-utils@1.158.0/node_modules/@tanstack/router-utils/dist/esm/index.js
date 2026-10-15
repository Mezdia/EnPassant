import { deadCodeElimination, generateFromAst, parseAst, stripTypeExports } from "./ast.js";
import { logDiff } from "./logger.js";
import { copyFilesPlugin } from "./copy-files-plugin.js";
import { findReferencedIdentifiers } from "babel-dead-code-elimination";
export {
  copyFilesPlugin,
  deadCodeElimination,
  findReferencedIdentifiers,
  generateFromAst,
  logDiff,
  parseAst,
  stripTypeExports
};
//# sourceMappingURL=index.js.map
