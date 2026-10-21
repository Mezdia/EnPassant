'use client';
import { getSplittedPath } from './get-splitted-path.mjs';

function getPath(path, values) {
  const splittedPath = getSplittedPath(path);
  if (splittedPath.length === 0 || typeof values !== "object" || values === null) {
    return void 0;
  }
  let value = values[splittedPath[0]];
  for (let i = 1; i < splittedPath.length; i += 1) {
    if (value == null) {
      break;
    }
    value = value[splittedPath[i]];
  }
  return value;
}

export { getPath };
//# sourceMappingURL=get-path.mjs.map
