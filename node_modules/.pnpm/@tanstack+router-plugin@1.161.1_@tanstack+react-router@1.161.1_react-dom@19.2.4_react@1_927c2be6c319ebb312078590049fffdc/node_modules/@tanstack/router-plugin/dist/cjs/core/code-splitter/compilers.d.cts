import { GeneratorResult, ParseAstOptions } from '@tanstack/router-utils';
import { CodeSplitGroupings, SplitRouteIdentNodes } from '../constants.cjs';
import { Config, DeletableNodes } from '../config.cjs';
import * as t from '@babel/types';
export declare function addSharedSearchParamToFilename(filename: string): string;
/**
 * Recursively walk an AST node and collect referenced identifier-like names.
 * Much cheaper than babel.traverse — no path/scope overhead.
 *
 * Notes:
 * - Uses @babel/types `isReferenced` to avoid collecting non-references like
 *   object keys, member expression properties, or binding identifiers.
 * - Also handles JSX identifiers for component references.
 */
export declare function collectIdentifiersFromNode(node: t.Node): Set<string>;
/**
 * Build a map from binding name → declaration AST node for all
 * locally-declared module-level bindings. Built once, O(1) lookup.
 */
export declare function buildDeclarationMap(ast: t.File): Map<string, t.Node>;
/**
 * Build a dependency graph: for each local binding, the set of other local
 * bindings its declaration references. Built once via simple node walking.
 */
export declare function buildDependencyGraph(declMap: Map<string, t.Node>, localBindings: Set<string>): Map<string, Set<string>>;
/**
 * Computes module-level bindings that are shared between split and non-split
 * route properties. These bindings need to be extracted into a shared virtual
 * module to avoid double-initialization.
 *
 * A binding is "shared" if it is referenced by at least one split property
 * AND at least one non-split property. Only locally-declared module-level
 * bindings are candidates (not imports — bundlers dedupe those).
 */
export declare function computeSharedBindings(opts: {
    code: string;
    codeSplitGroupings: CodeSplitGroupings;
}): Set<string>;
/**
 * If bindings from the same destructured declarator are referenced by
 * different groups, mark all bindings from that declarator as shared.
 */
export declare function expandSharedDestructuredDeclarators(ast: t.File, refsByGroup: Map<string, Set<number>>, shared: Set<string>): void;
/**
 * Collect locally-declared module-level binding names from a statement.
 * Pure node inspection, no traversal.
 */
export declare function collectLocalBindingsFromStatement(node: t.Statement | t.ModuleDeclaration, bindings: Set<string>): void;
/**
 * Collect direct module-level binding names referenced from a given AST node.
 * Uses a simple recursive walk instead of babel.traverse.
 */
export declare function collectModuleLevelRefsFromNode(node: t.Node, localModuleLevelBindings: Set<string>): Set<string>;
/**
 * Expand the shared set transitively using a prebuilt dependency graph.
 * No AST traversals — pure graph BFS.
 */
export declare function expandTransitively(shared: Set<string>, depGraph: Map<string, Set<string>>): void;
/**
 * Remove any bindings from `shared` that transitively depend on `Route`.
 * The Route singleton must remain in the reference file; if a shared binding
 * references it (directly or transitively), extracting that binding would
 * duplicate Route in the shared module.
 *
 * Uses `depGraph` which must include `Route` as a node so the dependency
 * chain is visible.
 */
export declare function removeBindingsDependingOnRoute(shared: Set<string>, depGraph: Map<string, Set<string>>): void;
/**
 * If any binding from a destructured declaration is shared,
 * ensure all bindings from that same declaration are also shared.
 * Pure node inspection of program.body, no traversal.
 */
export declare function expandDestructuredDeclarations(ast: t.File, shared: Set<string>): void;
export declare function compileCodeSplitReferenceRoute(opts: ParseAstOptions & {
    codeSplitGroupings: CodeSplitGroupings;
    deleteNodes?: Set<DeletableNodes>;
    targetFramework: Config['target'];
    filename: string;
    id: string;
    addHmr?: boolean;
    sharedBindings?: Set<string>;
}): GeneratorResult | null;
export declare function compileCodeSplitVirtualRoute(opts: ParseAstOptions & {
    splitTargets: Array<SplitRouteIdentNodes>;
    filename: string;
    sharedBindings?: Set<string>;
}): GeneratorResult;
/**
 * Compile the shared virtual module (`?tsr-shared=1`).
 * Keeps only shared binding declarations, their transitive dependencies,
 * and imports they need. Exports all shared bindings.
 */
export declare function compileCodeSplitSharedRoute(opts: ParseAstOptions & {
    sharedBindings: Set<string>;
    filename: string;
}): GeneratorResult;
/**
 * This function should read get the options from by searching for the key `codeSplitGroupings`
 * on createFileRoute and return it's values if it exists, else return undefined
 */
export declare function detectCodeSplitGroupingsFromRoute(opts: ParseAstOptions): {
    groupings: CodeSplitGroupings | undefined;
};
