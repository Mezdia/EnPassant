import * as t from "@babel/types";
import babel from "@babel/core";
import * as template from "@babel/template";
import { parseAst, findReferencedIdentifiers, deadCodeElimination, generateFromAst } from "@tanstack/router-utils";
import { tsrShared, tsrSplit } from "../constants.js";
import { routeHmrStatement } from "../route-hmr-statement.js";
import { createIdentifier } from "./path-ids.js";
import { getFrameworkOptions } from "./framework-options.js";
const SPLIT_NODES_CONFIG = /* @__PURE__ */ new Map([
  [
    "loader",
    {
      routeIdent: "loader",
      localImporterIdent: "$$splitLoaderImporter",
      // const $$splitLoaderImporter = () => import('...')
      splitStrategy: "lazyFn",
      localExporterIdent: "SplitLoader",
      // const SplitLoader = ...
      exporterIdent: "loader"
      // export { SplitLoader as loader }
    }
  ],
  [
    "component",
    {
      routeIdent: "component",
      localImporterIdent: "$$splitComponentImporter",
      // const $$splitComponentImporter = () => import('...')
      splitStrategy: "lazyRouteComponent",
      localExporterIdent: "SplitComponent",
      // const SplitComponent = ...
      exporterIdent: "component"
      // export { SplitComponent as component }
    }
  ],
  [
    "pendingComponent",
    {
      routeIdent: "pendingComponent",
      localImporterIdent: "$$splitPendingComponentImporter",
      // const $$splitPendingComponentImporter = () => import('...')
      splitStrategy: "lazyRouteComponent",
      localExporterIdent: "SplitPendingComponent",
      // const SplitPendingComponent = ...
      exporterIdent: "pendingComponent"
      // export { SplitPendingComponent as pendingComponent }
    }
  ],
  [
    "errorComponent",
    {
      routeIdent: "errorComponent",
      localImporterIdent: "$$splitErrorComponentImporter",
      // const $$splitErrorComponentImporter = () => import('...')
      splitStrategy: "lazyRouteComponent",
      localExporterIdent: "SplitErrorComponent",
      // const SplitErrorComponent = ...
      exporterIdent: "errorComponent"
      // export { SplitErrorComponent as errorComponent }
    }
  ],
  [
    "notFoundComponent",
    {
      routeIdent: "notFoundComponent",
      localImporterIdent: "$$splitNotFoundComponentImporter",
      // const $$splitNotFoundComponentImporter = () => import('...')
      splitStrategy: "lazyRouteComponent",
      localExporterIdent: "SplitNotFoundComponent",
      // const SplitNotFoundComponent = ...
      exporterIdent: "notFoundComponent"
      // export { SplitNotFoundComponent as notFoundComponent }
    }
  ]
]);
const KNOWN_SPLIT_ROUTE_IDENTS = [...SPLIT_NODES_CONFIG.keys()];
function addSplitSearchParamToFilename(filename, grouping) {
  const [bareFilename] = filename.split("?");
  const params = new URLSearchParams();
  params.append(tsrSplit, createIdentifier(grouping));
  const result = `${bareFilename}?${params.toString()}`;
  return result;
}
function removeSplitSearchParamFromFilename(filename) {
  const [bareFilename] = filename.split("?");
  return bareFilename;
}
function addSharedSearchParamToFilename(filename) {
  const [bareFilename] = filename.split("?");
  return `${bareFilename}?${tsrShared}=1`;
}
const splittableCreateRouteFns = ["createFileRoute"];
const unsplittableCreateRouteFns = [
  "createRootRoute",
  "createRootRouteWithContext"
];
const allCreateRouteFns = [
  ...splittableCreateRouteFns,
  ...unsplittableCreateRouteFns
];
function collectIdentifiersFromNode(node) {
  const ids = /* @__PURE__ */ new Set();
  (function walk(n, parent, grandparent, parentKey) {
    if (!n) return;
    if (t.isIdentifier(n)) {
      if (!parent || t.isReferenced(n, parent, grandparent)) {
        ids.add(n.name);
      }
      return;
    }
    if (t.isJSXIdentifier(n)) {
      if (parent && t.isJSXAttribute(parent) && parentKey === "name") {
        return;
      }
      if (parent && t.isJSXMemberExpression(parent) && parentKey === "property") {
        return;
      }
      const first = n.name[0];
      if (first && first === first.toLowerCase()) {
        return;
      }
      ids.add(n.name);
      return;
    }
    for (const key of t.VISITOR_KEYS[n.type] || []) {
      const child = n[key];
      if (Array.isArray(child)) {
        for (const c of child) {
          if (c && typeof c.type === "string") {
            walk(c, n, parent, key);
          }
        }
      } else if (child && typeof child.type === "string") {
        walk(child, n, parent, key);
      }
    }
  })(node);
  return ids;
}
function buildDeclarationMap(ast) {
  const map = /* @__PURE__ */ new Map();
  for (const stmt of ast.program.body) {
    const decl = t.isExportNamedDeclaration(stmt) && stmt.declaration ? stmt.declaration : stmt;
    if (t.isVariableDeclaration(decl)) {
      for (const declarator of decl.declarations) {
        for (const name of collectIdentifiersFromPattern(declarator.id)) {
          map.set(name, declarator);
        }
      }
    } else if (t.isFunctionDeclaration(decl) && decl.id) {
      map.set(decl.id.name, decl);
    } else if (t.isClassDeclaration(decl) && decl.id) {
      map.set(decl.id.name, decl);
    }
  }
  return map;
}
function buildDependencyGraph(declMap, localBindings) {
  const graph = /* @__PURE__ */ new Map();
  for (const [name, declNode] of declMap) {
    if (!localBindings.has(name)) continue;
    const allIds = collectIdentifiersFromNode(declNode);
    const deps = /* @__PURE__ */ new Set();
    for (const id of allIds) {
      if (id !== name && localBindings.has(id)) deps.add(id);
    }
    graph.set(name, deps);
  }
  return graph;
}
function computeSharedBindings(opts) {
  const ast = parseAst(opts);
  const localModuleLevelBindings = /* @__PURE__ */ new Set();
  for (const node of ast.program.body) {
    collectLocalBindingsFromStatement(node, localModuleLevelBindings);
  }
  localModuleLevelBindings.delete("Route");
  if (localModuleLevelBindings.size === 0) {
    return /* @__PURE__ */ new Set();
  }
  function findIndexForSplitNode(str) {
    return opts.codeSplitGroupings.findIndex(
      (group) => group.includes(str)
    );
  }
  let routeOptions;
  babel.traverse(ast, {
    CallExpression(path) {
      if (!t.isIdentifier(path.node.callee)) return;
      if (!splittableCreateRouteFns.includes(path.node.callee.name)) return;
      if (t.isCallExpression(path.parentPath.node)) {
        const opts2 = resolveIdentifier(path, path.parentPath.node.arguments[0]);
        if (t.isObjectExpression(opts2)) routeOptions = opts2;
      } else if (t.isVariableDeclarator(path.parentPath.node)) {
        const caller = resolveIdentifier(path, path.parentPath.node.init);
        if (t.isCallExpression(caller)) {
          const opts2 = resolveIdentifier(path, caller.arguments[0]);
          if (t.isObjectExpression(opts2)) routeOptions = opts2;
        }
      }
    }
  });
  if (!routeOptions) return /* @__PURE__ */ new Set();
  const splitGroupsPresent = /* @__PURE__ */ new Set();
  let hasNonSplit = false;
  for (const prop of routeOptions.properties) {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;
    if (prop.key.name === "codeSplitGroupings") continue;
    if (t.isIdentifier(prop.value) && prop.value.name === "undefined") continue;
    const groupIndex = findIndexForSplitNode(prop.key.name);
    if (groupIndex === -1) {
      hasNonSplit = true;
    } else {
      splitGroupsPresent.add(groupIndex);
    }
  }
  if (!hasNonSplit && splitGroupsPresent.size < 2) return /* @__PURE__ */ new Set();
  const declMap = buildDeclarationMap(ast);
  const depGraph = buildDependencyGraph(declMap, localModuleLevelBindings);
  const allLocalBindings = new Set(localModuleLevelBindings);
  allLocalBindings.add("Route");
  const fullDepGraph = buildDependencyGraph(declMap, allLocalBindings);
  const refsByGroup = /* @__PURE__ */ new Map();
  for (const prop of routeOptions.properties) {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;
    const key = prop.key.name;
    if (key === "codeSplitGroupings") continue;
    const groupIndex = findIndexForSplitNode(key);
    const directRefs = collectModuleLevelRefsFromNode(
      prop.value,
      localModuleLevelBindings
    );
    const allRefs = new Set(directRefs);
    expandTransitively(allRefs, depGraph);
    for (const ref of allRefs) {
      let groups = refsByGroup.get(ref);
      if (!groups) {
        groups = /* @__PURE__ */ new Set();
        refsByGroup.set(ref, groups);
      }
      groups.add(groupIndex);
    }
  }
  const shared = /* @__PURE__ */ new Set();
  for (const [name, groups] of refsByGroup) {
    if (groups.size >= 2) shared.add(name);
  }
  expandSharedDestructuredDeclarators(ast, refsByGroup, shared);
  if (shared.size === 0) return shared;
  expandDestructuredDeclarations(ast, shared);
  removeBindingsDependingOnRoute(shared, fullDepGraph);
  return shared;
}
function expandSharedDestructuredDeclarators(ast, refsByGroup, shared) {
  for (const stmt of ast.program.body) {
    const decl = t.isExportNamedDeclaration(stmt) && stmt.declaration ? stmt.declaration : stmt;
    if (!t.isVariableDeclaration(decl)) continue;
    for (const declarator of decl.declarations) {
      if (!t.isObjectPattern(declarator.id) && !t.isArrayPattern(declarator.id))
        continue;
      const names = collectIdentifiersFromPattern(declarator.id);
      const usedGroups = /* @__PURE__ */ new Set();
      for (const name of names) {
        const groups = refsByGroup.get(name);
        if (!groups) continue;
        for (const g of groups) usedGroups.add(g);
      }
      if (usedGroups.size >= 2) {
        for (const name of names) {
          shared.add(name);
        }
      }
    }
  }
}
function collectLocalBindingsFromStatement(node, bindings) {
  const decl = t.isExportNamedDeclaration(node) && node.declaration ? node.declaration : node;
  if (t.isVariableDeclaration(decl)) {
    for (const declarator of decl.declarations) {
      for (const name of collectIdentifiersFromPattern(declarator.id)) {
        bindings.add(name);
      }
    }
  } else if (t.isFunctionDeclaration(decl) && decl.id) {
    bindings.add(decl.id.name);
  } else if (t.isClassDeclaration(decl) && decl.id) {
    bindings.add(decl.id.name);
  }
}
function collectModuleLevelRefsFromNode(node, localModuleLevelBindings) {
  const allIds = collectIdentifiersFromNode(node);
  const refs = /* @__PURE__ */ new Set();
  for (const name of allIds) {
    if (localModuleLevelBindings.has(name)) refs.add(name);
  }
  return refs;
}
function expandTransitively(shared, depGraph) {
  const queue = [...shared];
  const visited = /* @__PURE__ */ new Set();
  while (queue.length > 0) {
    const name = queue.pop();
    if (visited.has(name)) continue;
    visited.add(name);
    const deps = depGraph.get(name);
    if (!deps) continue;
    for (const dep of deps) {
      if (!shared.has(dep)) {
        shared.add(dep);
        queue.push(dep);
      }
    }
  }
}
function removeBindingsDependingOnRoute(shared, depGraph) {
  const reverseGraph = /* @__PURE__ */ new Map();
  for (const [name, deps] of depGraph) {
    for (const dep of deps) {
      let parents = reverseGraph.get(dep);
      if (!parents) {
        parents = /* @__PURE__ */ new Set();
        reverseGraph.set(dep, parents);
      }
      parents.add(name);
    }
  }
  const visited = /* @__PURE__ */ new Set();
  const queue = ["Route"];
  while (queue.length > 0) {
    const cur = queue.pop();
    if (visited.has(cur)) continue;
    visited.add(cur);
    const parents = reverseGraph.get(cur);
    if (!parents) continue;
    for (const parent of parents) {
      if (!visited.has(parent)) queue.push(parent);
    }
  }
  for (const name of [...shared]) {
    if (visited.has(name)) {
      shared.delete(name);
    }
  }
}
function expandDestructuredDeclarations(ast, shared) {
  for (const stmt of ast.program.body) {
    const decl = t.isExportNamedDeclaration(stmt) && stmt.declaration ? stmt.declaration : stmt;
    if (!t.isVariableDeclaration(decl)) continue;
    for (const declarator of decl.declarations) {
      if (!t.isObjectPattern(declarator.id) && !t.isArrayPattern(declarator.id))
        continue;
      const names = collectIdentifiersFromPattern(declarator.id);
      const hasShared = names.some((n) => shared.has(n));
      if (hasShared) {
        for (const n of names) {
          shared.add(n);
        }
      }
    }
  }
}
function findExportedSharedBindings(ast, sharedBindings) {
  const exported = /* @__PURE__ */ new Set();
  for (const stmt of ast.program.body) {
    if (!t.isExportNamedDeclaration(stmt) || !stmt.declaration) continue;
    if (t.isVariableDeclaration(stmt.declaration)) {
      for (const decl of stmt.declaration.declarations) {
        for (const name of collectIdentifiersFromPattern(decl.id)) {
          if (sharedBindings.has(name)) exported.add(name);
        }
      }
    } else if (t.isFunctionDeclaration(stmt.declaration) && stmt.declaration.id) {
      if (sharedBindings.has(stmt.declaration.id.name))
        exported.add(stmt.declaration.id.name);
    } else if (t.isClassDeclaration(stmt.declaration) && stmt.declaration.id) {
      if (sharedBindings.has(stmt.declaration.id.name))
        exported.add(stmt.declaration.id.name);
    }
  }
  return exported;
}
function removeSharedDeclarations(ast, sharedBindings) {
  ast.program.body = ast.program.body.filter((stmt) => {
    const decl = t.isExportNamedDeclaration(stmt) && stmt.declaration ? stmt.declaration : stmt;
    if (t.isVariableDeclaration(decl)) {
      decl.declarations = decl.declarations.filter((declarator) => {
        const names = collectIdentifiersFromPattern(declarator.id);
        return !names.every((n) => sharedBindings.has(n));
      });
      if (decl.declarations.length === 0) return false;
    } else if (t.isFunctionDeclaration(decl) && decl.id) {
      if (sharedBindings.has(decl.id.name)) return false;
    } else if (t.isClassDeclaration(decl) && decl.id) {
      if (sharedBindings.has(decl.id.name)) return false;
    }
    return true;
  });
}
function compileCodeSplitReferenceRoute(opts) {
  const ast = parseAst(opts);
  const refIdents = findReferencedIdentifiers(ast);
  const knownExportedIdents = /* @__PURE__ */ new Set();
  function findIndexForSplitNode(str) {
    return opts.codeSplitGroupings.findIndex(
      (group) => group.includes(str)
    );
  }
  const frameworkOptions = getFrameworkOptions(opts.targetFramework);
  const PACKAGE = frameworkOptions.package;
  const LAZY_ROUTE_COMPONENT_IDENT = frameworkOptions.idents.lazyRouteComponent;
  const LAZY_FN_IDENT = frameworkOptions.idents.lazyFn;
  let createRouteFn;
  let modified = false;
  let hmrAdded = false;
  let sharedExportedNames;
  babel.traverse(ast, {
    Program: {
      enter(programPath) {
        const removableImportPaths = /* @__PURE__ */ new Set([]);
        programPath.traverse({
          CallExpression: (path) => {
            if (!t.isIdentifier(path.node.callee)) {
              return;
            }
            if (!allCreateRouteFns.includes(path.node.callee.name)) {
              return;
            }
            createRouteFn = path.node.callee.name;
            function babelHandleReference(routeOptions) {
              const hasImportedOrDefinedIdentifier = (name) => {
                return programPath.scope.hasBinding(name);
              };
              if (t.isObjectExpression(routeOptions)) {
                if (opts.deleteNodes && opts.deleteNodes.size > 0) {
                  routeOptions.properties = routeOptions.properties.filter(
                    (prop) => {
                      if (t.isObjectProperty(prop)) {
                        if (t.isIdentifier(prop.key)) {
                          if (opts.deleteNodes.has(prop.key.name)) {
                            modified = true;
                            return false;
                          }
                        }
                      }
                      return true;
                    }
                  );
                }
                if (!splittableCreateRouteFns.includes(createRouteFn)) {
                  if (opts.addHmr && !hmrAdded) {
                    programPath.pushContainer("body", routeHmrStatement);
                    modified = true;
                    hmrAdded = true;
                  }
                  return programPath.stop();
                }
                routeOptions.properties.forEach((prop) => {
                  if (t.isObjectProperty(prop)) {
                    if (t.isIdentifier(prop.key)) {
                      const key = prop.key.name;
                      const codeSplitGroupingByKey = findIndexForSplitNode(key);
                      if (codeSplitGroupingByKey === -1) {
                        return;
                      }
                      const codeSplitGroup = [
                        ...new Set(
                          opts.codeSplitGroupings[codeSplitGroupingByKey]
                        )
                      ];
                      const isNodeConfigAvailable = SPLIT_NODES_CONFIG.has(
                        key
                      );
                      if (!isNodeConfigAvailable) {
                        return;
                      }
                      if (t.isBooleanLiteral(prop.value) || t.isNullLiteral(prop.value) || t.isIdentifier(prop.value) && prop.value.name === "undefined") {
                        return;
                      }
                      const splitNodeMeta = SPLIT_NODES_CONFIG.get(key);
                      const splitUrl = addSplitSearchParamToFilename(
                        opts.filename,
                        codeSplitGroup
                      );
                      if (splitNodeMeta.splitStrategy === "lazyRouteComponent") {
                        const value = prop.value;
                        let shouldSplit = true;
                        if (t.isIdentifier(value)) {
                          const existingImportPath = getImportSpecifierAndPathFromLocalName(
                            programPath,
                            value.name
                          ).path;
                          if (existingImportPath) {
                            removableImportPaths.add(existingImportPath);
                          }
                          const isExported = hasExport(ast, value);
                          if (isExported) {
                            knownExportedIdents.add(value.name);
                          }
                          shouldSplit = !isExported;
                          if (shouldSplit) {
                            removeIdentifierLiteral(path, value);
                          }
                        }
                        if (!shouldSplit) {
                          return;
                        }
                        modified = true;
                        if (!hasImportedOrDefinedIdentifier(
                          LAZY_ROUTE_COMPONENT_IDENT
                        )) {
                          programPath.unshiftContainer("body", [
                            template.statement(
                              `import { ${LAZY_ROUTE_COMPONENT_IDENT} } from '${PACKAGE}'`
                            )()
                          ]);
                        }
                        if (!hasImportedOrDefinedIdentifier(
                          splitNodeMeta.localImporterIdent
                        )) {
                          programPath.unshiftContainer("body", [
                            template.statement(
                              `const ${splitNodeMeta.localImporterIdent} = () => import('${splitUrl}')`
                            )()
                          ]);
                        }
                        prop.value = template.expression(
                          `${LAZY_ROUTE_COMPONENT_IDENT}(${splitNodeMeta.localImporterIdent}, '${splitNodeMeta.exporterIdent}')`
                        )();
                        if (opts.addHmr && !hmrAdded) {
                          programPath.pushContainer("body", routeHmrStatement);
                          modified = true;
                          hmrAdded = true;
                        }
                      } else {
                        const value = prop.value;
                        let shouldSplit = true;
                        if (t.isIdentifier(value)) {
                          const existingImportPath = getImportSpecifierAndPathFromLocalName(
                            programPath,
                            value.name
                          ).path;
                          if (existingImportPath) {
                            removableImportPaths.add(existingImportPath);
                          }
                          const isExported = hasExport(ast, value);
                          if (isExported) {
                            knownExportedIdents.add(value.name);
                          }
                          shouldSplit = !isExported;
                          if (shouldSplit) {
                            removeIdentifierLiteral(path, value);
                          }
                        }
                        if (!shouldSplit) {
                          return;
                        }
                        modified = true;
                        if (!hasImportedOrDefinedIdentifier(LAZY_FN_IDENT)) {
                          programPath.unshiftContainer(
                            "body",
                            template.smart(
                              `import { ${LAZY_FN_IDENT} } from '${PACKAGE}'`
                            )()
                          );
                        }
                        if (!hasImportedOrDefinedIdentifier(
                          splitNodeMeta.localImporterIdent
                        )) {
                          programPath.unshiftContainer("body", [
                            template.statement(
                              `const ${splitNodeMeta.localImporterIdent} = () => import('${splitUrl}')`
                            )()
                          ]);
                        }
                        prop.value = template.expression(
                          `${LAZY_FN_IDENT}(${splitNodeMeta.localImporterIdent}, '${splitNodeMeta.exporterIdent}')`
                        )();
                      }
                    }
                  }
                  programPath.scope.crawl();
                });
              }
            }
            if (t.isCallExpression(path.parentPath.node)) {
              const options = resolveIdentifier(
                path,
                path.parentPath.node.arguments[0]
              );
              babelHandleReference(options);
            } else if (t.isVariableDeclarator(path.parentPath.node)) {
              const caller = resolveIdentifier(path, path.parentPath.node.init);
              if (t.isCallExpression(caller)) {
                const options = resolveIdentifier(path, caller.arguments[0]);
                babelHandleReference(options);
              }
            }
          }
        });
        if (removableImportPaths.size > 0) {
          modified = true;
          programPath.traverse({
            ImportDeclaration(path) {
              if (path.node.specifiers.length > 0) return;
              if (removableImportPaths.has(path.node.source.value)) {
                path.remove();
              }
            }
          });
        }
        if (opts.sharedBindings && opts.sharedBindings.size > 0) {
          sharedExportedNames = findExportedSharedBindings(
            ast,
            opts.sharedBindings
          );
          removeSharedDeclarations(ast, opts.sharedBindings);
          const sharedModuleUrl = addSharedSearchParamToFilename(opts.filename);
          const sharedImportSpecifiers = [...opts.sharedBindings].map(
            (name) => t.importSpecifier(t.identifier(name), t.identifier(name))
          );
          const [sharedImportPath] = programPath.unshiftContainer(
            "body",
            t.importDeclaration(
              sharedImportSpecifiers,
              t.stringLiteral(sharedModuleUrl)
            )
          );
          sharedImportPath.traverse({
            Identifier(identPath) {
              if (identPath.parentPath.isImportSpecifier() && identPath.key === "local") {
                refIdents.add(identPath);
              }
            }
          });
          if (sharedExportedNames.size > 0) {
            const reExportSpecifiers = [...sharedExportedNames].map(
              (name) => t.exportSpecifier(t.identifier(name), t.identifier(name))
            );
            programPath.pushContainer(
              "body",
              t.exportNamedDeclaration(
                null,
                reExportSpecifiers,
                t.stringLiteral(sharedModuleUrl)
              )
            );
          }
        }
      }
    }
  });
  if (!modified) {
    return null;
  }
  deadCodeElimination(ast, refIdents);
  if (knownExportedIdents.size > 0) {
    const warningMessage = createNotExportableMessage(
      opts.filename,
      knownExportedIdents
    );
    console.warn(warningMessage);
    if (process.env.NODE_ENV !== "production") {
      const warningTemplate = template.statement(
        `console.warn(${JSON.stringify(warningMessage)})`
      )();
      ast.program.body.unshift(warningTemplate);
    }
  }
  const result = generateFromAst(ast, {
    sourceMaps: true,
    sourceFileName: opts.filename,
    filename: opts.filename
  });
  if (result.map) {
    result.map.sourcesContent = [opts.code];
  }
  return result;
}
function compileCodeSplitVirtualRoute(opts) {
  const ast = parseAst(opts);
  const refIdents = findReferencedIdentifiers(ast);
  if (opts.sharedBindings && opts.sharedBindings.size > 0) {
    removeSharedDeclarations(ast, opts.sharedBindings);
  }
  const intendedSplitNodes = new Set(opts.splitTargets);
  const knownExportedIdents = /* @__PURE__ */ new Set();
  babel.traverse(ast, {
    Program: {
      enter(programPath) {
        const trackedNodesToSplitByType = {
          component: void 0,
          loader: void 0,
          pendingComponent: void 0,
          errorComponent: void 0,
          notFoundComponent: void 0
        };
        programPath.traverse({
          CallExpression: (path) => {
            if (!t.isIdentifier(path.node.callee)) {
              return;
            }
            if (!splittableCreateRouteFns.includes(path.node.callee.name)) {
              return;
            }
            function babelHandleVirtual(options) {
              if (t.isObjectExpression(options)) {
                options.properties.forEach((prop) => {
                  if (t.isObjectProperty(prop)) {
                    KNOWN_SPLIT_ROUTE_IDENTS.forEach((splitType) => {
                      if (!t.isIdentifier(prop.key) || prop.key.name !== splitType) {
                        return;
                      }
                      const value = prop.value;
                      if (t.isIdentifier(value) && value.name === "undefined") {
                        return;
                      }
                      let isExported = false;
                      if (t.isIdentifier(value)) {
                        isExported = hasExport(ast, value);
                        if (isExported) {
                          knownExportedIdents.add(value.name);
                        }
                      }
                      if (isExported && t.isIdentifier(value)) {
                        removeExports(ast, value);
                      } else {
                        const meta = SPLIT_NODES_CONFIG.get(splitType);
                        trackedNodesToSplitByType[splitType] = {
                          node: prop.value,
                          meta
                        };
                      }
                    });
                  }
                });
                options.properties = [];
              }
            }
            if (t.isCallExpression(path.parentPath.node)) {
              const options = resolveIdentifier(
                path,
                path.parentPath.node.arguments[0]
              );
              babelHandleVirtual(options);
            } else if (t.isVariableDeclarator(path.parentPath.node)) {
              const caller = resolveIdentifier(path, path.parentPath.node.init);
              if (t.isCallExpression(caller)) {
                const options = resolveIdentifier(path, caller.arguments[0]);
                babelHandleVirtual(options);
              }
            }
          }
        });
        intendedSplitNodes.forEach((SPLIT_TYPE) => {
          const splitKey = trackedNodesToSplitByType[SPLIT_TYPE];
          if (!splitKey) {
            return;
          }
          let splitNode = splitKey.node;
          const splitMeta = { ...splitKey.meta, shouldRemoveNode: true };
          let originalIdentName;
          if (t.isIdentifier(splitNode)) {
            originalIdentName = splitNode.name;
          }
          while (t.isIdentifier(splitNode)) {
            const binding = programPath.scope.getBinding(splitNode.name);
            splitNode = binding?.path.node;
          }
          if (splitNode) {
            if (t.isFunctionDeclaration(splitNode)) {
              if (!splitNode.id) {
                throw new Error(
                  `Function declaration for "${SPLIT_TYPE}" must have an identifier.`
                );
              }
              splitMeta.shouldRemoveNode = false;
              splitMeta.localExporterIdent = splitNode.id.name;
            } else if (t.isFunctionExpression(splitNode) || t.isArrowFunctionExpression(splitNode)) {
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitMeta.localExporterIdent),
                    splitNode
                  )
                ])
              );
            } else if (t.isImportSpecifier(splitNode) || t.isImportDefaultSpecifier(splitNode)) {
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitMeta.localExporterIdent),
                    splitNode.local
                  )
                ])
              );
            } else if (t.isVariableDeclarator(splitNode)) {
              if (t.isIdentifier(splitNode.id)) {
                splitMeta.localExporterIdent = splitNode.id.name;
                splitMeta.shouldRemoveNode = false;
              } else if (t.isObjectPattern(splitNode.id)) {
                if (originalIdentName) {
                  splitMeta.localExporterIdent = originalIdentName;
                }
                splitMeta.shouldRemoveNode = false;
              } else {
                throw new Error(
                  `Unexpected splitNode type ☝️: ${splitNode.type}`
                );
              }
            } else if (t.isCallExpression(splitNode)) {
              const outputSplitNodeCode = generateFromAst(splitNode).code;
              const splitNodeAst = babel.parse(outputSplitNodeCode);
              if (!splitNodeAst) {
                throw new Error(
                  `Failed to parse the generated code for "${SPLIT_TYPE}" in the node type "${splitNode.type}"`
                );
              }
              const statement = splitNodeAst.program.body[0];
              if (!statement) {
                throw new Error(
                  `Failed to parse the generated code for "${SPLIT_TYPE}" in the node type "${splitNode.type}" as no statement was found in the program body`
                );
              }
              if (t.isExpressionStatement(statement)) {
                const expression = statement.expression;
                programPath.pushContainer(
                  "body",
                  t.variableDeclaration("const", [
                    t.variableDeclarator(
                      t.identifier(splitMeta.localExporterIdent),
                      expression
                    )
                  ])
                );
              } else {
                throw new Error(
                  `Unexpected expression type encounter for "${SPLIT_TYPE}" in the node type "${splitNode.type}"`
                );
              }
            } else if (t.isConditionalExpression(splitNode)) {
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitMeta.localExporterIdent),
                    splitNode
                  )
                ])
              );
            } else if (t.isTSAsExpression(splitNode)) {
              splitNode = splitNode.expression;
              programPath.pushContainer(
                "body",
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    t.identifier(splitMeta.localExporterIdent),
                    splitNode
                  )
                ])
              );
            } else if (t.isBooleanLiteral(splitNode)) {
              return;
            } else if (t.isNullLiteral(splitNode)) {
              return;
            } else {
              console.info("Unexpected splitNode type:", splitNode);
              throw new Error(`Unexpected splitNode type ☝️: ${splitNode.type}`);
            }
          }
          if (splitMeta.shouldRemoveNode) {
            programPath.node.body = programPath.node.body.filter((node) => {
              return node !== splitNode;
            });
          }
          programPath.pushContainer("body", [
            t.exportNamedDeclaration(null, [
              t.exportSpecifier(
                t.identifier(splitMeta.localExporterIdent),
                // local variable name
                t.identifier(splitMeta.exporterIdent)
                // as what name it should be exported as
              )
            ])
          ]);
        });
        programPath.traverse({
          ExportNamedDeclaration(path) {
            if (path.node.declaration) {
              if (t.isVariableDeclaration(path.node.declaration)) {
                const specifiers = path.node.declaration.declarations.flatMap(
                  (decl) => {
                    if (t.isIdentifier(decl.id)) {
                      return [
                        t.importSpecifier(
                          t.identifier(decl.id.name),
                          t.identifier(decl.id.name)
                        )
                      ];
                    }
                    if (t.isObjectPattern(decl.id)) {
                      return collectIdentifiersFromPattern(decl.id).map(
                        (name) => t.importSpecifier(
                          t.identifier(name),
                          t.identifier(name)
                        )
                      );
                    }
                    if (t.isArrayPattern(decl.id)) {
                      return collectIdentifiersFromPattern(decl.id).map(
                        (name) => t.importSpecifier(
                          t.identifier(name),
                          t.identifier(name)
                        )
                      );
                    }
                    return [];
                  }
                );
                if (specifiers.length === 0) {
                  path.remove();
                  return;
                }
                const importDecl = t.importDeclaration(
                  specifiers,
                  t.stringLiteral(
                    removeSplitSearchParamFromFilename(opts.filename)
                  )
                );
                path.replaceWith(importDecl);
                path.traverse({
                  Identifier(identPath) {
                    if (identPath.parentPath.isImportSpecifier() && identPath.key === "local") {
                      refIdents.add(identPath);
                    }
                  }
                });
              }
            }
          }
        });
        if (opts.sharedBindings && opts.sharedBindings.size > 0) {
          const sharedImportSpecifiers = [...opts.sharedBindings].map(
            (name) => t.importSpecifier(t.identifier(name), t.identifier(name))
          );
          const sharedModuleUrl = addSharedSearchParamToFilename(
            removeSplitSearchParamFromFilename(opts.filename)
          );
          const [sharedImportPath] = programPath.unshiftContainer(
            "body",
            t.importDeclaration(
              sharedImportSpecifiers,
              t.stringLiteral(sharedModuleUrl)
            )
          );
          sharedImportPath.traverse({
            Identifier(identPath) {
              if (identPath.parentPath.isImportSpecifier() && identPath.key === "local") {
                refIdents.add(identPath);
              }
            }
          });
        }
      }
    }
  });
  deadCodeElimination(ast, refIdents);
  {
    const locallyBound = /* @__PURE__ */ new Set();
    for (const stmt of ast.program.body) {
      collectLocalBindingsFromStatement(stmt, locallyBound);
    }
    ast.program.body = ast.program.body.filter((stmt) => {
      if (!t.isExpressionStatement(stmt)) return true;
      const refs = collectIdentifiersFromNode(stmt);
      return [...refs].some((name) => locallyBound.has(name));
    });
  }
  if (ast.program.body.length === 0) {
    ast.program.directives = [];
  }
  const result = generateFromAst(ast, {
    sourceMaps: true,
    sourceFileName: opts.filename,
    filename: opts.filename
  });
  if (result.map) {
    result.map.sourcesContent = [opts.code];
  }
  return result;
}
function compileCodeSplitSharedRoute(opts) {
  const ast = parseAst(opts);
  const refIdents = findReferencedIdentifiers(ast);
  const localBindings = /* @__PURE__ */ new Set();
  for (const node of ast.program.body) {
    collectLocalBindingsFromStatement(node, localBindings);
  }
  localBindings.delete("Route");
  const declMap = buildDeclarationMap(ast);
  const depGraph = buildDependencyGraph(declMap, localBindings);
  const keepBindings = new Set(opts.sharedBindings);
  keepBindings.delete("Route");
  expandTransitively(keepBindings, depGraph);
  ast.program.body = ast.program.body.filter((stmt) => {
    if (t.isImportDeclaration(stmt)) return true;
    const decl = t.isExportNamedDeclaration(stmt) && stmt.declaration ? stmt.declaration : stmt;
    if (t.isVariableDeclaration(decl)) {
      decl.declarations = decl.declarations.filter((declarator) => {
        const names = collectIdentifiersFromPattern(declarator.id);
        return names.some((n) => keepBindings.has(n));
      });
      if (decl.declarations.length === 0) return false;
      if (t.isExportNamedDeclaration(stmt) && stmt.declaration) {
        return true;
      }
      return true;
    } else if (t.isFunctionDeclaration(decl) && decl.id) {
      return keepBindings.has(decl.id.name);
    } else if (t.isClassDeclaration(decl) && decl.id) {
      return keepBindings.has(decl.id.name);
    }
    return false;
  });
  ast.program.body = ast.program.body.map((stmt) => {
    if (t.isExportNamedDeclaration(stmt) && stmt.declaration) {
      return stmt.declaration;
    }
    return stmt;
  });
  const exportNames = [...opts.sharedBindings].sort(
    (a, b) => a.localeCompare(b)
  );
  const exportSpecifiers = exportNames.map(
    (name) => t.exportSpecifier(t.identifier(name), t.identifier(name))
  );
  if (exportSpecifiers.length > 0) {
    const exportDecl = t.exportNamedDeclaration(null, exportSpecifiers);
    ast.program.body.push(exportDecl);
    babel.traverse(ast, {
      Program(programPath) {
        const bodyPaths = programPath.get("body");
        const last = bodyPaths[bodyPaths.length - 1];
        if (last && last.isExportNamedDeclaration()) {
          last.traverse({
            Identifier(identPath) {
              if (identPath.parentPath.isExportSpecifier() && identPath.key === "local") {
                refIdents.add(identPath);
              }
            }
          });
        }
        programPath.stop();
      }
    });
  }
  deadCodeElimination(ast, refIdents);
  if (ast.program.body.length === 0) {
    ast.program.directives = [];
  }
  const result = generateFromAst(ast, {
    sourceMaps: true,
    sourceFileName: opts.filename,
    filename: opts.filename
  });
  if (result.map) {
    result.map.sourcesContent = [opts.code];
  }
  return result;
}
function detectCodeSplitGroupingsFromRoute(opts) {
  const ast = parseAst(opts);
  let codeSplitGroupings = void 0;
  babel.traverse(ast, {
    Program: {
      enter(programPath) {
        programPath.traverse({
          CallExpression(path) {
            if (!t.isIdentifier(path.node.callee)) {
              return;
            }
            if (!(path.node.callee.name === "createRoute" || path.node.callee.name === "createFileRoute")) {
              return;
            }
            function babelHandleSplittingGroups(routeOptions) {
              if (t.isObjectExpression(routeOptions)) {
                routeOptions.properties.forEach((prop) => {
                  if (t.isObjectProperty(prop)) {
                    if (t.isIdentifier(prop.key)) {
                      if (prop.key.name === "codeSplitGroupings") {
                        const value = prop.value;
                        if (t.isArrayExpression(value)) {
                          codeSplitGroupings = value.elements.map((group) => {
                            if (t.isArrayExpression(group)) {
                              return group.elements.map((node) => {
                                if (!t.isStringLiteral(node)) {
                                  throw new Error(
                                    "You must provide a string literal for the codeSplitGroupings"
                                  );
                                }
                                return node.value;
                              });
                            }
                            throw new Error(
                              "You must provide arrays with codeSplitGroupings options."
                            );
                          });
                        } else {
                          throw new Error(
                            "You must provide an array of arrays for the codeSplitGroupings."
                          );
                        }
                      }
                    }
                  }
                });
              }
            }
            if (t.isCallExpression(path.parentPath.node)) {
              const options = resolveIdentifier(
                path,
                path.parentPath.node.arguments[0]
              );
              babelHandleSplittingGroups(options);
            } else if (t.isVariableDeclarator(path.parentPath.node)) {
              const caller = resolveIdentifier(path, path.parentPath.node.init);
              if (t.isCallExpression(caller)) {
                const options = resolveIdentifier(path, caller.arguments[0]);
                babelHandleSplittingGroups(options);
              }
            }
          }
        });
      }
    }
  });
  return { groupings: codeSplitGroupings };
}
function createNotExportableMessage(filename, idents) {
  const list = Array.from(idents).map((d) => `- ${d}`);
  const message = [
    `[tanstack-router] These exports from "${filename}" will not be code-split and will increase your bundle size:`,
    ...list,
    "For the best optimization, these items should either have their export statements removed, or be imported from another location that is not a route file."
  ].join("\n");
  return message;
}
function getImportSpecifierAndPathFromLocalName(programPath, name) {
  let specifier = null;
  let path = null;
  programPath.traverse({
    ImportDeclaration(importPath) {
      const found = importPath.node.specifiers.find(
        (targetSpecifier) => targetSpecifier.local.name === name
      );
      if (found) {
        specifier = found;
        path = importPath.node.source.value;
      }
    }
  });
  return { specifier, path };
}
function collectIdentifiersFromPattern(node) {
  if (!node) {
    return [];
  }
  if (t.isIdentifier(node)) {
    return [node.name];
  }
  if (t.isAssignmentPattern(node)) {
    return collectIdentifiersFromPattern(node.left);
  }
  if (t.isRestElement(node)) {
    return collectIdentifiersFromPattern(node.argument);
  }
  if (t.isObjectPattern(node)) {
    return node.properties.flatMap((prop) => {
      if (t.isObjectProperty(prop)) {
        return collectIdentifiersFromPattern(prop.value);
      }
      if (t.isRestElement(prop)) {
        return collectIdentifiersFromPattern(prop.argument);
      }
      return [];
    });
  }
  if (t.isArrayPattern(node)) {
    return node.elements.flatMap(
      (element) => collectIdentifiersFromPattern(element)
    );
  }
  return [];
}
function resolveIdentifier(path, node) {
  if (t.isIdentifier(node)) {
    const binding = path.scope.getBinding(node.name);
    if (binding) {
      const declarator = binding.path.node;
      if (t.isObjectExpression(declarator.init)) {
        return declarator.init;
      } else if (t.isFunctionDeclaration(declarator.init)) {
        return declarator.init;
      }
    }
    return void 0;
  }
  return node;
}
function removeIdentifierLiteral(path, node) {
  const binding = path.scope.getBinding(node.name);
  if (binding) {
    if (t.isVariableDeclarator(binding.path.node) && t.isObjectPattern(binding.path.node.id)) {
      const objectPattern = binding.path.node.id;
      objectPattern.properties = objectPattern.properties.filter((prop) => {
        if (!t.isObjectProperty(prop)) {
          return true;
        }
        if (t.isIdentifier(prop.value) && prop.value.name === node.name) {
          return false;
        }
        if (t.isAssignmentPattern(prop.value) && t.isIdentifier(prop.value.left) && prop.value.left.name === node.name) {
          return false;
        }
        return true;
      });
      if (objectPattern.properties.length === 0) {
        binding.path.remove();
      }
      return;
    }
    binding.path.remove();
  }
}
function hasExport(ast, node) {
  let found = false;
  babel.traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        if (t.isVariableDeclaration(path.node.declaration)) {
          path.node.declaration.declarations.forEach((decl) => {
            if (t.isVariableDeclarator(decl)) {
              if (t.isIdentifier(decl.id)) {
                if (decl.id.name === node.name) {
                  found = true;
                }
              } else if (t.isObjectPattern(decl.id) || t.isArrayPattern(decl.id)) {
                const names = collectIdentifiersFromPattern(decl.id);
                if (names.includes(node.name)) {
                  found = true;
                }
              }
            }
          });
        }
        if (t.isFunctionDeclaration(path.node.declaration)) {
          if (t.isIdentifier(path.node.declaration.id)) {
            if (path.node.declaration.id.name === node.name) {
              found = true;
            }
          }
        }
      }
    },
    ExportDefaultDeclaration(path) {
      if (t.isIdentifier(path.node.declaration)) {
        if (path.node.declaration.name === node.name) {
          found = true;
        }
      }
      if (t.isFunctionDeclaration(path.node.declaration)) {
        if (t.isIdentifier(path.node.declaration.id)) {
          if (path.node.declaration.id.name === node.name) {
            found = true;
          }
        }
      }
    }
  });
  return found;
}
function removeExports(ast, node) {
  let removed = false;
  babel.traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        if (t.isVariableDeclaration(path.node.declaration)) {
          path.node.declaration.declarations.forEach((decl) => {
            if (t.isVariableDeclarator(decl)) {
              if (t.isIdentifier(decl.id)) {
                if (decl.id.name === node.name) {
                  path.remove();
                  removed = true;
                }
              } else if (t.isObjectPattern(decl.id) || t.isArrayPattern(decl.id)) {
                const names = collectIdentifiersFromPattern(decl.id);
                if (names.includes(node.name)) {
                  path.remove();
                  removed = true;
                }
              }
            }
          });
        } else if (t.isFunctionDeclaration(path.node.declaration)) {
          if (t.isIdentifier(path.node.declaration.id)) {
            if (path.node.declaration.id.name === node.name) {
              path.remove();
              removed = true;
            }
          }
        }
      }
    },
    ExportDefaultDeclaration(path) {
      if (t.isIdentifier(path.node.declaration)) {
        if (path.node.declaration.name === node.name) {
          path.remove();
          removed = true;
        }
      } else if (t.isFunctionDeclaration(path.node.declaration)) {
        if (t.isIdentifier(path.node.declaration.id)) {
          if (path.node.declaration.id.name === node.name) {
            path.remove();
            removed = true;
          }
        }
      }
    }
  });
  return removed;
}
export {
  addSharedSearchParamToFilename,
  buildDeclarationMap,
  buildDependencyGraph,
  collectIdentifiersFromNode,
  collectLocalBindingsFromStatement,
  collectModuleLevelRefsFromNode,
  compileCodeSplitReferenceRoute,
  compileCodeSplitSharedRoute,
  compileCodeSplitVirtualRoute,
  computeSharedBindings,
  detectCodeSplitGroupingsFromRoute,
  expandDestructuredDeclarations,
  expandSharedDestructuredDeclarators,
  expandTransitively,
  removeBindingsDependingOnRoute
};
//# sourceMappingURL=compilers.js.map
