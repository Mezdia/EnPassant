"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sassTildeImporter = exports.resolveUrls = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var DEFAULT_EXTS = ['scss', 'sass', 'css'];
function resolveUrls(url, extensions) {
    if (extensions === void 0) { extensions = DEFAULT_EXTS; }
    // We only care about tilde-prefixed imports that do not look like paths.
    if (!url.startsWith('~') || url.startsWith('~/')) {
        return [];
    }
    var module_path = path_1.default.join('node_modules', url.substring(1));
    var variants = [module_path];
    var parts = path_1.default.parse(module_path);
    // Support sass partials by including paths where the file is prefixed by an underscore.
    if (!parts.base.startsWith('_')) {
        var underscore_name = '_'.concat(parts.name);
        var replacement = {
            root: parts.root,
            dir: parts.dir,
            ext: parts.ext,
            base: "".concat(underscore_name).concat(parts.ext),
            name: underscore_name,
        };
        variants.push(path_1.default.format(replacement));
    }
    // Support index files.
    variants.push(path_1.default.join(module_path, '_index'));
    // Create variants such that it has entries of the form
    // node_modules/@foo/bar/baz.(scss|sass)
    // for an import of the form ~@foo/bar/baz(.(scss|sass))?
    if (!extensions.some(function (ext) { return parts.ext == ".".concat(ext); })) {
        variants = extensions.flatMap(function (ext) {
            return variants.map(function (variant) { return "".concat(variant, ".").concat(ext); });
        });
    }
    return variants;
}
exports.resolveUrls = resolveUrls;
/**
 * Creates a sass importer which resolves Webpack-style tilde-imports.
 */
exports.sassTildeImporter = {
    findFileUrl: function (url) {
        var searchPaths = resolveUrls(url);
        for (var _i = 0, searchPaths_1 = searchPaths; _i < searchPaths_1.length; _i++) {
            var searchPath = searchPaths_1[_i];
            if (fs_1.default.existsSync(searchPath)) {
                return new URL("file://".concat(path_1.default.resolve(searchPath)));
            }
        }
        // Returning null is not itself an error, it tells sass to instead try the
        // next import resolution method if one exists
        return null;
    },
};
