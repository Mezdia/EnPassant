"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDtsExports = void 0;
var source_map_js_1 = require("source-map-js");
var classTransforms_1 = require("./classTransforms");
var validVarRegexp_1 = require("./validVarRegexp");
var isValidVariable = function (classname) {
    return validVarRegexp_1.VALID_VARIABLE_REGEXP.test(classname);
};
var flattenClassNames = function (previousValue, currentValue) {
    if (previousValue === void 0) { previousValue = []; }
    return previousValue.concat(currentValue);
};
var createDtsExports = function (_a) {
    var _b, _c;
    var cssExports = _a.cssExports, fileName = _a.fileName, logger = _a.logger, options = _a.options;
    var classes = cssExports.classes;
    var possiblyUndefined = Boolean(options.noUncheckedIndexedAccess);
    var classnameToProperty = function (classname) {
        return "'".concat(classname, "'").concat(possiblyUndefined ? '?' : '', ": string;");
    };
    var classnameToNamedExport = function (classname) {
        return "export let ".concat(classname, ": string").concat(possiblyUndefined ? ' | undefined' : '', ";");
    };
    var processedClasses = Object.keys(classes)
        .map((0, classTransforms_1.transformClasses)(options.classnameTransform))
        .reduce(flattenClassNames, []);
    var filteredClasses = processedClasses
        .filter(isValidVariable)
        .map(classnameToNamedExport);
    var dts = '';
    if (options.goToDefinition && cssExports.sourceMap) {
        // Create a new source map consumer.
        var smc_1 = new source_map_js_1.SourceMapConsumer(cssExports.sourceMap);
        // Split original CSS file into lines.
        var cssLines_1 = (_c = (_b = cssExports.css) === null || _b === void 0 ? void 0 : _b.split('\n')) !== null && _c !== void 0 ? _c : [];
        // Create new equal size array of empty strings.
        var dtsLines_1 = Array.from(Array(cssLines_1.length), function () { return ''; });
        // Create a list of filtered classnames and hashed classnames.
        var filteredClasses_1 = Object.entries(cssExports.classes)
            .map(function (_a) {
            var classname = _a[0], originalClassname = _a[1];
            return [
                // TODO: Improve this. It may return multiple valid classnames and we
                // want to handle all of those.
                (0, classTransforms_1.transformClasses)(options.classnameTransform)(classname)[0],
                originalClassname,
            ];
        })
            .filter(function (_a) {
            var classname = _a[0];
            return isValidVariable(classname);
        });
        filteredClasses_1.forEach(function (_a) {
            var classname = _a[0], originalClassname = _a[1];
            var matchedLine;
            var matchedColumn;
            for (var i = 0; i < cssLines_1.length; i++) {
                var match = new RegExp(
                // NOTE: This excludes any match not starting with:
                // - `.` for classnames,
                // - `:` or ` ` for animation names,
                // and any matches followed by valid CSS selector characters.
                "[:.\\s]".concat(originalClassname, "(?![_a-zA-Z0-9-])"), 'g').exec(cssLines_1[i]);
                if (match) {
                    matchedLine = i;
                    matchedColumn = match.index;
                    break;
                }
            }
            var lineNumber = smc_1.originalPositionFor({
                // Lines start at 1, not 0.
                line: matchedLine ? matchedLine + 1 : 1,
                column: matchedColumn ? matchedColumn : 0,
            }).line;
            dtsLines_1[lineNumber ? lineNumber - 1 : 0] +=
                classnameToNamedExport(classname);
        });
        dts = dtsLines_1.join('\n');
    }
    dts += "declare let _classes: {\n  ".concat(processedClasses.map(classnameToProperty).join('\n  ')).concat(options.allowUnknownClassnames ? '\n  [key: string]: string;' : '', "\n};\nexport default _classes;\n");
    if (!options.goToDefinition &&
        options.namedExports !== false &&
        filteredClasses.length) {
        dts += filteredClasses.join('\n') + '\n';
    }
    if (options.customTemplate) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var customTemplate = require(options.customTemplate);
        return customTemplate(dts, {
            classes: classes,
            fileName: fileName,
            logger: logger,
        });
    }
    return dts;
};
exports.createDtsExports = createDtsExports;
