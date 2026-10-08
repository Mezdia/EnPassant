"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCssExports = exports.getFileType = void 0;
var path_1 = __importDefault(require("path"));
var less_1 = __importDefault(require("less"));
var sass_1 = __importDefault(require("sass"));
var icss_utils_1 = require("icss-utils");
var tsconfig_paths_1 = require("tsconfig-paths");
var sassTildeImporter_1 = require("../importers/sassTildeImporter");
var getFileType = function (fileName) {
    if (fileName.endsWith('.css'))
        return "css" /* FileType.css */;
    if (fileName.endsWith('.less'))
        return "less" /* FileType.less */;
    if (fileName.endsWith('.sass'))
        return "sass" /* FileType.sass */;
    if (fileName.endsWith('.styl'))
        return "styl" /* FileType.styl */;
    return "scss" /* FileType.scss */;
};
exports.getFileType = getFileType;
var getFilePath = function (fileName) { return path_1.default.dirname(fileName); };
var getCssExports = function (_a) {
    var _b, _c, _d, _e;
    var css = _a.css, fileName = _a.fileName, logger = _a.logger, options = _a.options, processor = _a.processor, compilerOptions = _a.compilerOptions, directory = _a.directory;
    var rawCss = options.additionalData ? options.additionalData + css : css;
    var fileType = (0, exports.getFileType)(fileName);
    var rendererOptions = (_b = options.rendererOptions) !== null && _b !== void 0 ? _b : {};
    var transformedCss = '';
    var sourceMap;
    try {
        if (options.customRenderer) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var customRenderer = require(options.customRenderer);
            var result = customRenderer(rawCss, {
                fileName: fileName,
                logger: logger,
                compilerOptions: compilerOptions,
            });
            if (typeof result === 'string') {
                transformedCss = result;
            }
            else if (result.css) {
                transformedCss = result.css;
                sourceMap = result.sourceMap;
            }
        }
        else {
            switch (fileType) {
                case "less" /* FileType.less */:
                    less_1.default.render(rawCss, __assign({ syncImport: true, filename: fileName, paths: [directory], sourceMap: true }, ((_c = rendererOptions.less) !== null && _c !== void 0 ? _c : {})), function (error, output) {
                        if (error) {
                            throw new Error(error.message);
                        }
                        if (output === undefined) {
                            throw new Error('No Less output.');
                        }
                        // This is typed as a `string`, but may be undefined.
                        var stringSourceMap = output.map;
                        sourceMap =
                            typeof stringSourceMap === 'string'
                                ? JSON.parse(stringSourceMap)
                                : undefined;
                        transformedCss = output.css.toString();
                    });
                    break;
                case "scss" /* FileType.scss */:
                case "sass" /* FileType.sass */: {
                    var filePath = getFilePath(fileName);
                    var _f = (_d = rendererOptions.sass) !== null && _d !== void 0 ? _d : {}, loadPaths = _f.loadPaths, sassOptions = __rest(_f, ["loadPaths"]);
                    var _g = compilerOptions.baseUrl, baseUrl = _g === void 0 ? directory : _g, paths = compilerOptions.paths;
                    var matchPath_1 = baseUrl && paths
                        ? (0, tsconfig_paths_1.createMatchPath)(path_1.default.resolve(baseUrl), paths)
                        : null;
                    var aliasImporter = {
                        findFileUrl: function (url) {
                            var exactFileUrl = matchPath_1 === null || matchPath_1 === void 0 ? void 0 : matchPath_1(url, undefined, undefined, [
                                '.sass',
                                '.scss',
                            ]);
                            if (exactFileUrl) {
                                return new URL("file://".concat(exactFileUrl));
                            }
                            /*
                             * In case it didn't find the exact file it'll proceed to
                             * check other files matching the import process of Sass
                             * guidelines:
                             * https://sass-lang.com/documentation/at-rules/import/#partials
                             * https://sass-lang.com/documentation/at-rules/import/#index-files
                             */
                            // Checks for partials
                            var partialFileName = path_1.default.basename(url);
                            var partialDirName = path_1.default.dirname(url);
                            var partialFilePath = path_1.default.join(partialDirName, "_".concat(partialFileName));
                            var partialFileUrl = matchPath_1 !== null
                                ? matchPath_1(partialFilePath, undefined, undefined, [
                                    '.sass',
                                    '.scss',
                                ])
                                : undefined;
                            if (partialFileUrl) {
                                return new URL("file://".concat(partialFileUrl));
                            }
                            // Checks for an _index file
                            var indexFilePath = path_1.default.join(partialDirName, partialFileName, "_index");
                            var indexFileUrl = matchPath_1 !== null
                                ? matchPath_1(indexFilePath, undefined, undefined, [
                                    '.sass',
                                    '.scss',
                                ])
                                : undefined;
                            return indexFileUrl ? new URL("file://".concat(indexFileUrl)) : null;
                        },
                    };
                    var importers = [aliasImporter, sassTildeImporter_1.sassTildeImporter];
                    var result = sass_1.default.compileString(rawCss, __assign({ importers: importers, loadPaths: __spreadArray([filePath, 'node_modules'], (loadPaths !== null && loadPaths !== void 0 ? loadPaths : []), true), sourceMap: true, syntax: fileType === "sass" /* FileType.sass */ ? 'indented' : 'scss', url: new URL("file://".concat(fileName)) }, sassOptions));
                    sourceMap = result.sourceMap;
                    transformedCss = result.css.toString();
                    break;
                }
                case "styl" /* FileType.styl */: {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    var stylus = require('stylus');
                    transformedCss = stylus(rawCss, __assign(__assign({}, ((_e = rendererOptions.stylus) !== null && _e !== void 0 ? _e : {})), { filename: fileName })).render();
                    break;
                }
                default:
                    transformedCss = rawCss;
                    break;
            }
        }
        var processedCss = processor.process(transformedCss, {
            from: fileName,
            map: {
                inline: false,
                prev: sourceMap,
            },
        });
        return {
            classes: (0, icss_utils_1.extractICSS)(processedCss.root).icssExports,
            css: processedCss.css,
            sourceMap: processedCss.map.toJSON(),
        };
    }
    catch (e) {
        console.error(e);
        logger.error(e);
        return { classes: {} };
    }
};
exports.getCssExports = getCssExports;
