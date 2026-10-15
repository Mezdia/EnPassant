"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var postcss_load_config_1 = __importDefault(require("postcss-load-config"));
var createMatchers_1 = require("./helpers/createMatchers");
var getDtsSnapshot_1 = require("./helpers/getDtsSnapshot");
var logger_1 = require("./helpers/logger");
var getProcessor_1 = require("./helpers/getProcessor");
var filterPlugins_1 = require("./helpers/filterPlugins");
var getPostCssConfigPlugins = function (directory) {
    try {
        return postcss_load_config_1.default.sync({}, directory).plugins;
    }
    catch (error) {
        return [];
    }
};
var init = function (_a) {
    var ts = _a.typescript;
    if (process.env.DISABLE_TS_PLUGIN_CSS_MODULES !== undefined) {
        return {
            create: function (info) { return info.languageService; },
        };
    }
    var _isCSS;
    function create(info) {
        var _a, _b, _c, _d;
        var logger = (0, logger_1.createLogger)(info);
        var directory = info.project.getCurrentDirectory();
        var compilerOptions = info.project.getCompilerOptions();
        var languageServiceHost = {};
        var languageServiceHostProxy = new Proxy(info.languageServiceHost, {
            get: function (target, key) {
                return languageServiceHost[key]
                    ? languageServiceHost[key]
                    : target[key];
            },
        });
        var languageService = ts.createLanguageService(languageServiceHostProxy);
        // TypeScript plugins have a `cwd` of `/`, which causes issues with import resolution.
        process.chdir(directory);
        // User options for plugin.
        var options = (_a = info.config.options) !== null && _a !== void 0 ? _a : {};
        logger.log("options: ".concat(JSON.stringify(options)));
        // Load environment variables like SASS_PATH.
        // TODO: Add tests for this option.
        var dotenvOptions = options.dotenvOptions;
        if (dotenvOptions) {
            dotenvOptions.path = path_1.default.resolve(directory, (_b = dotenvOptions.path) !== null && _b !== void 0 ? _b : '.env');
        }
        dotenv_1.default.config(dotenvOptions);
        // Normalise SASS_PATH array to absolute paths.
        if (process.env.SASS_PATH) {
            process.env.SASS_PATH = process.env.SASS_PATH.split(path_1.default.delimiter)
                .map(function (sassPath) {
                return path_1.default.isAbsolute(sassPath)
                    ? sassPath
                    : path_1.default.resolve(directory, sassPath);
            })
                .join(path_1.default.delimiter);
        }
        // Add postCSS config if enabled.
        var postcssOptions = (_d = (_c = options.postcssOptions) !== null && _c !== void 0 ? _c : options.postCssOptions) !== null && _d !== void 0 ? _d : {};
        var userPlugins = [];
        if (postcssOptions.useConfig) {
            var postcssConfigPlugins = getPostCssConfigPlugins(directory);
            userPlugins = (0, filterPlugins_1.filterPlugins)({
                plugins: postcssConfigPlugins,
                exclude: postcssOptions.excludePlugins,
            });
        }
        // If a custom renderer is provided, resolve the path.
        if (options.customRenderer) {
            if (fs_1.default.existsSync(path_1.default.resolve(directory, options.customRenderer))) {
                options.customRenderer = path_1.default.resolve(directory, options.customRenderer);
            }
            else if (fs_1.default.existsSync(require.resolve(options.customRenderer))) {
                options.customRenderer = require.resolve(options.customRenderer);
            }
            else {
                logger.error(new Error("The file or package for `customRenderer` '".concat(options.customRenderer, "' could not be resolved.")));
            }
        }
        // If a custom template is provided, resolve the path.
        if (options.customTemplate) {
            options.customTemplate = path_1.default.resolve(directory, options.customTemplate);
        }
        // Create PostCSS processor.
        var processor = (0, getProcessor_1.getProcessor)(userPlugins);
        // Create matchers using options object.
        var _e = (0, createMatchers_1.createMatchers)(logger, options), isCSS = _e.isCSS, isRelativeCSS = _e.isRelativeCSS;
        _isCSS = isCSS;
        languageServiceHost.getScriptKind = function (fileName) {
            if (!info.languageServiceHost.getScriptKind) {
                return ts.ScriptKind.Unknown;
            }
            if (isCSS(fileName)) {
                return ts.ScriptKind.TS;
            }
            return info.languageServiceHost.getScriptKind(fileName);
        };
        languageServiceHost.getScriptSnapshot = function (fileName) {
            if (isCSS(fileName) && fs_1.default.existsSync(fileName)) {
                return (0, getDtsSnapshot_1.getDtsSnapshot)(ts, processor, fileName, options, logger, compilerOptions, directory);
            }
            return info.languageServiceHost.getScriptSnapshot(fileName);
        };
        var createModuleResolver = function (containingFile) {
            return function (moduleName, resolveModule) {
                if (isRelativeCSS(moduleName)) {
                    return {
                        extension: ts.Extension.Dts,
                        isExternalLibraryImport: false,
                        resolvedFileName: path_1.default.resolve(path_1.default.dirname(containingFile), moduleName),
                    };
                }
                if (isCSS(moduleName)) {
                    // TODO: Move this section to a separate file and add basic tests.
                    // Attempts to locate the module using TypeScript's previous search paths. These include "baseUrl" and "paths".
                    var resolvedModule = resolveModule();
                    if (!resolvedModule)
                        return;
                    var baseUrl_1 = info.project.getCompilerOptions().baseUrl;
                    var match_1 = '/index.ts';
                    // An array of paths TypeScript searched for the module. All include .ts, .tsx, .d.ts, or .json extensions.
                    // NOTE: TypeScript doesn't expose this in their interfaces, which is why the type is unknown.
                    // https://github.com/microsoft/TypeScript/issues/28770
                    var failedLocations = resolvedModule.failedLookupLocations;
                    // Filter to only one extension type, and remove that extension. This leaves us with the actual file name.
                    // Example: "usr/person/project/src/dir/File.module.css/index.d.ts" > "usr/person/project/src/dir/File.module.css"
                    var normalizedLocations = failedLocations.reduce(function (locations, location) {
                        if ((baseUrl_1 ? location.includes(baseUrl_1) : true) &&
                            location.endsWith(match_1)) {
                            return __spreadArray(__spreadArray([], locations, true), [location.replace(match_1, '')], false);
                        }
                        return locations;
                    }, []);
                    // Find the imported CSS module, if it exists.
                    var cssModulePath = normalizedLocations.find(function (location) {
                        return fs_1.default.existsSync(location);
                    });
                    if (cssModulePath) {
                        return {
                            extension: ts.Extension.Dts,
                            isExternalLibraryImport: false,
                            resolvedFileName: path_1.default.resolve(cssModulePath),
                        };
                    }
                }
            };
        };
        // TypeScript 5.x
        if (info.languageServiceHost.resolveModuleNameLiterals) {
            var _resolveModuleNameLiterals_1 = info.languageServiceHost.resolveModuleNameLiterals.bind(info.languageServiceHost);
            languageServiceHost.resolveModuleNameLiterals = function (moduleNames, containingFile) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                var resolvedModules = _resolveModuleNameLiterals_1.apply(void 0, __spreadArray([moduleNames,
                    containingFile], rest, false));
                var moduleResolver = createModuleResolver(containingFile);
                return moduleNames.map(function (_a, index) {
                    var moduleName = _a.text;
                    try {
                        var resolvedModule = moduleResolver(moduleName, function () { return resolvedModules[index]; });
                        if (resolvedModule)
                            return { resolvedModule: resolvedModule };
                    }
                    catch (e) {
                        logger.error(e);
                        return resolvedModules[index];
                    }
                    return resolvedModules[index];
                });
            };
        }
        // TypeScript 4.x
        else if (info.languageServiceHost.resolveModuleNames) {
            var _resolveModuleNames_1 = info.languageServiceHost.resolveModuleNames.bind(info.languageServiceHost);
            languageServiceHost.resolveModuleNames = function (moduleNames, containingFile) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                var resolvedModules = _resolveModuleNames_1.apply(void 0, __spreadArray([moduleNames,
                    containingFile], rest, false));
                var moduleResolver = createModuleResolver(containingFile);
                return moduleNames.map(function (moduleName, index) {
                    try {
                        var resolvedModule = moduleResolver(moduleName, function () {
                            var _a;
                            return (_a = languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache) === null || _a === void 0 ? void 0 : _a.call(languageServiceHost, moduleName, containingFile);
                        });
                        if (resolvedModule)
                            return resolvedModule;
                    }
                    catch (e) {
                        logger.error(e);
                        return resolvedModules[index];
                    }
                    return resolvedModules[index];
                });
            };
        }
        return languageService;
    }
    function getExternalFiles(project) {
        return project.getFileNames().filter(_isCSS);
    }
    return { create: create, getExternalFiles: getExternalFiles };
};
module.exports = init;
