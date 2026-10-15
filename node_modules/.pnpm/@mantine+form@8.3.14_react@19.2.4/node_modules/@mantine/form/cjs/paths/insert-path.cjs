'use client';
'use strict';

var getPath = require('./get-path.cjs');
var setPath = require('./set-path.cjs');

function insertPath(path, value, index, values) {
  const currentValue = getPath.getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  const cloned = [...currentValue];
  cloned.splice(typeof index === "number" ? index : cloned.length, 0, value);
  return setPath.setPath(path, cloned, values);
}

exports.insertPath = insertPath;
//# sourceMappingURL=insert-path.cjs.map
