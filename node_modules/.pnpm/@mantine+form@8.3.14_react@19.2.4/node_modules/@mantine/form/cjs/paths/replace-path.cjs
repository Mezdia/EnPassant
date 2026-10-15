'use client';
'use strict';

var getPath = require('./get-path.cjs');
var setPath = require('./set-path.cjs');

function replacePath(path, item, index, values) {
  const currentValue = getPath.getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  if (currentValue.length <= index) {
    return values;
  }
  const cloned = [...currentValue];
  cloned[index] = item;
  return setPath.setPath(path, cloned, values);
}

exports.replacePath = replacePath;
//# sourceMappingURL=replace-path.cjs.map
