'use client';
'use strict';

var full = require('klona/full');
var getSplittedPath = require('./get-splitted-path.cjs');

function setPath(path, value, values) {
  const splittedPath = getSplittedPath.getSplittedPath(path);
  if (splittedPath.length === 0) {
    return values;
  }
  const cloned = full.klona(values);
  if (splittedPath.length === 1) {
    cloned[splittedPath[0]] = value;
    return cloned;
  }
  let val = cloned[splittedPath[0]];
  for (let i = 1; i < splittedPath.length - 1; i += 1) {
    if (val === void 0) {
      return cloned;
    }
    val = val[splittedPath[i]];
  }
  val[splittedPath[splittedPath.length - 1]] = value;
  return cloned;
}

exports.setPath = setPath;
//# sourceMappingURL=set-path.cjs.map
