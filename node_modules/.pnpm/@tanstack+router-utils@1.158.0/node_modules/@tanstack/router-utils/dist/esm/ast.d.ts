import { findReferencedIdentifiers } from 'babel-dead-code-elimination';
import { GeneratorOptions, GeneratorResult } from '@babel/generator';
import { ParseResult, ParserOptions } from '@babel/parser';
import type * as _babel_types from '@babel/types';
export type ParseAstOptions = ParserOptions & {
    code: string;
};
export type ParseAstResult = ParseResult<_babel_types.File>;
export declare function parseAst({ code, ...opts }: ParseAstOptions): ParseAstResult;
type GenerateFromAstOptions = GeneratorOptions & Required<Pick<GeneratorOptions, 'sourceFileName' | 'filename'>>;
export declare function generateFromAst(ast: _babel_types.Node, opts?: GenerateFromAstOptions): GeneratorResult;
export type { GeneratorResult } from '@babel/generator';
/**
 * Strips TypeScript type-only exports and imports from an AST.
 *
 * This is necessary because babel-dead-code-elimination doesn't handle
 * TypeScript type exports/imports. When a type export references an import
 * that pulls in server-only code, the dead code elimination won't remove
 * that import because it sees the type as still referencing it.
 *
 * This function removes:
 * - `export type Foo = ...`
 * - `export interface Foo { ... }`
 * - `export type { Foo } from './module.js'`
 * - `export type * from './module.js'`
 * - Type specifiers in mixed exports: `export { value, type Foo }` -> `export { value }`
 * - `import type { Foo } from './module.js'`
 * - Type specifiers in mixed imports: `import { value, type Foo } from './module.js'` -> `import { value }`
 *
 * Note: Non-exported type/interface declarations are preserved as they may be
 * used as type annotations within the code.
 *
 * @param ast - The Babel AST (or ParseResult) to mutate
 */
export declare function stripTypeExports(ast: ParseResult<_babel_types.File>): void;
export { findReferencedIdentifiers };
/**
 * Performs dead code elimination on the AST, with TypeScript type stripping.
 *
 * This is a wrapper around babel-dead-code-elimination that first strips
 * TypeScript type-only exports and imports. This is necessary because
 * babel-dead-code-elimination doesn't handle type exports, which can cause
 * imports to be retained when they're only referenced by type exports.
 *
 * @param ast - The Babel AST to mutate
 * @param candidates - Optional set of identifier paths to consider for removal.
 *                     If provided, only these identifiers will be candidates for removal.
 *                     This should be the result of `findReferencedIdentifiers(ast)` called
 *                     before any AST transformations.
 */
export declare function deadCodeElimination(ast: ParseResult<_babel_types.File>, candidates?: ReturnType<typeof findReferencedIdentifiers>): void;
