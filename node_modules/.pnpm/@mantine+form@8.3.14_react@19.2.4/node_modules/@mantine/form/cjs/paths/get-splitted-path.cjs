'use client';
'use strict';

function getSplittedPath(path) {
  if (typeof path !== "string") {
    return [];
  }
  return path.split(".");
}

exports.getSplittedPath = getSplittedPath;
//# sourceMappingURL=get-splitted-path.cjs.map
