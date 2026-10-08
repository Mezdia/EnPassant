"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPlugins = void 0;
var filterPlugins = function (_a) {
    var plugins = _a.plugins, exclude = _a.exclude;
    return exclude
        ? plugins.filter(function (plugin) {
            return 'postcssPlugin' in plugin && !exclude.includes(plugin.postcssPlugin);
        })
        : plugins;
};
exports.filterPlugins = filterPlugins;
