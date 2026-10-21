export { parseAst, generateFromAst, deadCodeElimination, findReferencedIdentifiers, stripTypeExports, } from './ast.cjs';
export type { ParseAstOptions, ParseAstResult, GeneratorResult } from './ast.cjs';
export { logDiff } from './logger.cjs';
export { copyFilesPlugin } from './copy-files-plugin.cjs';
