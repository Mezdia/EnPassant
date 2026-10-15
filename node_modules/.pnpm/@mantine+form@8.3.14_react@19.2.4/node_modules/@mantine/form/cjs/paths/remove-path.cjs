'use client';
'use strict';

var getPath = require('./get-path.cjs');
var setPath = require('./set-path.cjs');

function removePath(path, index, values) {
  const currentValue = getPath.getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  return setPath.setPath(
    path,
    currentValue.filter((_, itemIndex) => itemIndex !== index),
    values
  );
}

exports.removePath = removePath;
//# sourceMappingURL=remove-path.cjs.map
