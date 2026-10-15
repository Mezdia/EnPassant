'use client';
import { klona } from 'klona/full';
import { getSplittedPath } from './get-splitted-path.mjs';

function setPath(path, value, values) {
  const splittedPath = getSplittedPath(path);
  if (splittedPath.length === 0) {
    return values;
  }
  const cloned = klona(values);
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

export { setPath };
//# sourceMappingURL=set-path.mjs.map
