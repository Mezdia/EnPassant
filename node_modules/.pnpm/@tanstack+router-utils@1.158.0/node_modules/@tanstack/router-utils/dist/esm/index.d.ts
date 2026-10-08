export { parseAst, generateFromAst, deadCodeElimination, findReferencedIdentifiers, stripTypeExports, } from './ast.js';
export type { ParseAstOptions, ParseAstResult, GeneratorResult } from './ast.js';
export { logDiff } from './logger.js';
export { copyFilesPlugin } from './copy-files-plugin.js';
