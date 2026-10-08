'use client';
'use strict';

var getPath = require('./get-path.cjs');
var setPath = require('./set-path.cjs');

function reorderPath(path, { from, to }, values) {
  const currentValue = getPath.getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  const cloned = [...currentValue];
  const item = currentValue[from];
  cloned.splice(from, 1);
  cloned.splice(to, 0, item);
  return setPath.setPath(path, cloned, values);
}

exports.reorderPath = reorderPath;
//# sourceMappingURL=reorder-path.cjs.map
