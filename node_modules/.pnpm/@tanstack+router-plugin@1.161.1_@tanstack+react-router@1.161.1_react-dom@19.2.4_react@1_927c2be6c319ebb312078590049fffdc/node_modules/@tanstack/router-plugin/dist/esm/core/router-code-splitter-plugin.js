import { pathToFileURL, fileURLToPath } from "node:url";
import { logDiff } from "@tanstack/router-utils";
import { getConfig, splitGroupingsSchema } from "./config.js";
import { compileCodeSplitSharedRoute, detectCodeSplitGroupingsFromRoute, computeSharedBindings, compileCodeSplitReferenceRoute, compileCodeSplitVirtualRoute } from "./code-splitter/compilers.js";
import { tsrSplit, tsrShared, splitRouteIdentNodes, defaultCodeSplitGroupings } from "./constants.js";
import { decodeIdentifier } from "./code-splitter/path-ids.js";
import { normalizePath, debug } from "./utils.js";
const PLUGIN_NAME = "unplugin:router-code-splitter";
const CODE_SPLITTER_PLUGIN_NAME = "tanstack-router:code-splitter:compile-reference-file";
const TRANSFORMATION_PLUGINS_BY_FRAMEWORK = {
  react: [
    {
      // Babel-based React plugin
      pluginNames: ["vite:react-babel", "vite:react-refresh"],
      pkg: "@vitejs/plugin-react",
      usage: "react()"
    },
    {
      // SWC-based React plugin
      pluginNames: ["vite:react-swc", "vite:react-swc:resolve-runtime"],
      pkg: "@vitejs/plugin-react-swc",
      usage: "reactSwc()"
    },
    {
      // OXC-based React plugin (deprecated but should still be handled)
      pluginNames: ["vite:react-oxc:config", "vite:react-oxc:refresh-runtime"],
      pkg: "@vitejs/plugin-react-oxc",
      usage: "reactOxc()"
    }
  ],
  solid: [
    {
      pluginNames: ["solid"],
      pkg: "vite-plugin-solid",
      usage: "solid()"
    }
  ]
};
const unpluginRouterCodeSplitterFactory = (options = {}, { framework: _framework }) => {
  let ROOT = process.cwd();
  let userConfig;
  function initUserConfig() {
    if (typeof options === "function") {
      userConfig = options();
    } else {
      userConfig = getConfig(options, ROOT);
    }
  }
  const isProduction = process.env.NODE_ENV === "production";
  const sharedBindingsMap = /* @__PURE__ */ new Map();
  const getGlobalCodeSplitGroupings = () => {
    return userConfig.codeSplittingOptions?.defaultBehavior || defaultCodeSplitGroupings;
  };
  const getShouldSplitFn = () => {
    return userConfig.codeSplittingOptions?.splitBehavior;
  };
  const handleCompilingReferenceFile = (code, id, generatorNodeInfo) => {
    if (debug) console.info("Compiling Route: ", id);
    const fromCode = detectCodeSplitGroupingsFromRoute({
      code
    });
    if (fromCode.groupings) {
      const res = splitGroupingsSchema.safeParse(fromCode.groupings);
      if (!res.success) {
        const message = res.error.errors.map((e) => e.message).join(". ");
        throw new Error(
          `The groupings for the route "${id}" are invalid.
${message}`
        );
      }
    }
    const userShouldSplitFn = getShouldSplitFn();
    const pluginSplitBehavior = userShouldSplitFn?.({
      routeId: generatorNodeInfo.routePath
    });
    if (pluginSplitBehavior) {
      const res = splitGroupingsSchema.safeParse(pluginSplitBehavior);
      if (!res.success) {
        const message = res.error.errors.map((e) => e.message).join(". ");
        throw new Error(
          `The groupings returned when using \`splitBehavior\` for the route "${id}" are invalid.
${message}`
        );
      }
    }
    const splitGroupings = fromCode.groupings || pluginSplitBehavior || getGlobalCodeSplitGroupings();
    const sharedBindings = computeSharedBindings({
      code,
      codeSplitGroupings: splitGroupings
    });
    if (sharedBindings.size > 0) {
      sharedBindingsMap.set(id, sharedBindings);
    } else {
      sharedBindingsMap.delete(id);
    }
    const compiledReferenceRoute = compileCodeSplitReferenceRoute({
      code,
      codeSplitGroupings: splitGroupings,
      targetFramework: userConfig.target,
      filename: id,
      id,
      deleteNodes: userConfig.codeSplittingOptions?.deleteNodes ? new Set(userConfig.codeSplittingOptions.deleteNodes) : void 0,
      addHmr: (userConfig.codeSplittingOptions?.addHmr ?? true) && !isProduction,
      sharedBindings: sharedBindings.size > 0 ? sharedBindings : void 0
    });
    if (compiledReferenceRoute === null) {
      if (debug) {
        console.info(
          `No changes made to route "${id}", skipping code-splitting.`
        );
      }
      return null;
    }
    if (debug) {
      logDiff(code, compiledReferenceRoute.code);
      console.log("Output:\n", compiledReferenceRoute.code + "\n\n");
    }
    return compiledReferenceRoute;
  };
  const handleCompilingVirtualFile = (code, id) => {
    if (debug) console.info("Splitting Route: ", id);
    const [_, ...pathnameParts] = id.split("?");
    const searchParams = new URLSearchParams(pathnameParts.join("?"));
    const splitValue = searchParams.get(tsrSplit);
    if (!splitValue) {
      throw new Error(
        `The split value for the virtual route "${id}" was not found.`
      );
    }
    const rawGrouping = decodeIdentifier(splitValue);
    const grouping = [...new Set(rawGrouping)].filter(
      (p) => splitRouteIdentNodes.includes(p)
    );
    const baseId = id.split("?")[0];
    const resolvedSharedBindings = sharedBindingsMap.get(baseId);
    const result = compileCodeSplitVirtualRoute({
      code,
      filename: id,
      splitTargets: grouping,
      sharedBindings: resolvedSharedBindings
    });
    if (debug) {
      logDiff(code, result.code);
      console.log("Output:\n", result.code + "\n\n");
    }
    return result;
  };
  const includedCode = [
    "createFileRoute(",
    "createRootRoute(",
    "createRootRouteWithContext("
  ];
  return [
    {
      name: "tanstack-router:code-splitter:compile-reference-file",
      enforce: "pre",
      transform: {
        filter: {
          id: {
            exclude: [tsrSplit, tsrShared],
            // this is necessary for webpack / rspack to avoid matching .html files
            include: /\.(m|c)?(j|t)sx?$/
          },
          code: {
            include: includedCode
          }
        },
        handler(code, id) {
          const normalizedId = normalizePath(id);
          const generatorFileInfo = globalThis.TSR_ROUTES_BY_ID_MAP?.get(normalizedId);
          if (generatorFileInfo && includedCode.some((included) => code.includes(included))) {
            return handleCompilingReferenceFile(
              code,
              normalizedId,
              generatorFileInfo
            );
          }
          return null;
        }
      },
      vite: {
        configResolved(config) {
          ROOT = config.root;
          initUserConfig();
          const routerPluginIndex = config.plugins.findIndex(
            (p) => p.name === CODE_SPLITTER_PLUGIN_NAME
          );
          if (routerPluginIndex === -1) return;
          const frameworkPlugins = TRANSFORMATION_PLUGINS_BY_FRAMEWORK[userConfig.target];
          if (!frameworkPlugins) return;
          for (const transformPlugin of frameworkPlugins) {
            const transformPluginIndex = config.plugins.findIndex(
              (p) => transformPlugin.pluginNames.includes(p.name)
            );
            if (transformPluginIndex !== -1 && transformPluginIndex < routerPluginIndex) {
              throw new Error(
                `Plugin order error: '${transformPlugin.pkg}' is placed before '@tanstack/router-plugin'.

The TanStack Router plugin must come BEFORE JSX transformation plugins.

Please update your Vite config:

  plugins: [
    tanstackRouter(),
    ${transformPlugin.usage},
  ]
`
              );
            }
          }
        },
        applyToEnvironment(environment) {
          if (userConfig.plugin?.vite?.environmentName) {
            return userConfig.plugin.vite.environmentName === environment.name;
          }
          return true;
        }
      },
      rspack(compiler) {
        ROOT = process.cwd();
        initUserConfig();
        if (compiler.options.mode === "production") {
          compiler.hooks.done.tap(PLUGIN_NAME, () => {
            console.info("✅ " + PLUGIN_NAME + ": code-splitting done!");
          });
        }
      },
      webpack(compiler) {
        ROOT = process.cwd();
        initUserConfig();
        if (compiler.options.mode === "production") {
          compiler.hooks.done.tap(PLUGIN_NAME, () => {
            console.info("✅ " + PLUGIN_NAME + ": code-splitting done!");
          });
        }
      }
    },
    {
      name: "tanstack-router:code-splitter:compile-virtual-file",
      enforce: "pre",
      transform: {
        filter: {
          id: /tsr-split/
        },
        handler(code, id) {
          const url = pathToFileURL(id);
          url.searchParams.delete("v");
          const normalizedId = normalizePath(fileURLToPath(url));
          return handleCompilingVirtualFile(code, normalizedId);
        }
      },
      vite: {
        applyToEnvironment(environment) {
          if (userConfig.plugin?.vite?.environmentName) {
            return userConfig.plugin.vite.environmentName === environment.name;
          }
          return true;
        }
      }
    },
    {
      name: "tanstack-router:code-splitter:compile-shared-file",
      enforce: "pre",
      transform: {
        filter: {
          id: /tsr-shared/
        },
        handler(code, id) {
          const url = pathToFileURL(id);
          url.searchParams.delete("v");
          const normalizedId = normalizePath(fileURLToPath(url));
          const [baseId] = normalizedId.split("?");
          if (!baseId) return null;
          const sharedBindings = sharedBindingsMap.get(baseId);
          if (!sharedBindings || sharedBindings.size === 0) return null;
          if (debug) console.info("Compiling Shared Module: ", id);
          const result = compileCodeSplitSharedRoute({
            code,
            sharedBindings,
            filename: normalizedId
          });
          if (debug) {
            logDiff(code, result.code);
            console.log("Output:\n", result.code + "\n\n");
          }
          return result;
        }
      },
      vite: {
        applyToEnvironment(environment) {
          if (userConfig.plugin?.vite?.environmentName) {
            return userConfig.plugin.vite.environmentName === environment.name;
          }
          return true;
        }
      }
    }
  ];
};
export {
  unpluginRouterCodeSplitterFactory
};
//# sourceMappingURL=router-code-splitter-plugin.js.map
