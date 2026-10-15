"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDtsSnapshot = void 0;
var fs_1 = require("fs");
var getCssExports_1 = require("./getCssExports");
var createDtsExports_1 = require("./createDtsExports");
var getDtsSnapshot = function (ts, processor, fileName, options, logger, compilerOptions, directory) {
    var css = (0, fs_1.readFileSync)(fileName, 'utf-8');
    var cssExports = (0, getCssExports_1.getCssExports)({
        css: css,
        fileName: fileName,
        logger: logger,
        options: options,
        processor: processor,
        compilerOptions: compilerOptions,
        directory: directory,
    });
    var dts = (0, createDtsExports_1.createDtsExports)({ cssExports: cssExports, fileName: fileName, logger: logger, options: options });
    return ts.ScriptSnapshot.fromString(dts);
};
exports.getDtsSnapshot = getDtsSnapshot;
