'use client';
function getSplittedPath(path) {
  if (typeof path !== "string") {
    return [];
  }
  return path.split(".");
}

export { getSplittedPath };
//# sourceMappingURL=get-splitted-path.mjs.map
