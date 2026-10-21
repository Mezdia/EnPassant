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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessor = void 0;
var postcss_1 = __importDefault(require("postcss"));
var postcss_modules_local_by_default_1 = __importDefault(require("postcss-modules-local-by-default"));
var postcss_modules_scope_1 = __importDefault(require("postcss-modules-scope"));
var postcss_modules_extract_imports_1 = __importDefault(require("postcss-modules-extract-imports"));
var getProcessor = function (additionalPlugins) {
    if (additionalPlugins === void 0) { additionalPlugins = []; }
    return (0, postcss_1.default)(__spreadArray(__spreadArray([], additionalPlugins, true), [
        (0, postcss_modules_local_by_default_1.default)(),
        (0, postcss_modules_extract_imports_1.default)(),
        (0, postcss_modules_scope_1.default)({
            generateScopedName: function (name) { return name; },
        }),
    ], false));
};
exports.getProcessor = getProcessor;
