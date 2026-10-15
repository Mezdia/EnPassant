"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformClasses = void 0;
var lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
// The below is based on the CSS Modules implementation found here:
// https://github.com/webpack-contrib/css-loader
var dashCase = function (classname) {
    return classname.replace(/-+(\w)/g, function (_match, firstLetter) {
        return firstLetter.toUpperCase();
    });
};
var transformClasses = function (camelCaseOption) {
    return function (classname) {
        var entries = [];
        switch (camelCaseOption) {
            case 'camelCase': {
                entries.push(classname);
                var targetClassName = (0, lodash_camelcase_1.default)(classname);
                if (targetClassName !== classname) {
                    entries.push(targetClassName);
                }
                break;
            }
            case 'camelCaseOnly':
                entries.push((0, lodash_camelcase_1.default)(classname));
                break;
            case 'dashes': {
                entries.push(classname);
                var targetClassName = dashCase(classname);
                if (targetClassName !== classname) {
                    entries.push(targetClassName);
                }
                break;
            }
            case 'dashesOnly':
                entries.push(dashCase(classname));
                break;
            case 'asIs':
            default:
                entries.push(classname);
                break;
        }
        return entries;
    };
};
exports.transformClasses = transformClasses;
