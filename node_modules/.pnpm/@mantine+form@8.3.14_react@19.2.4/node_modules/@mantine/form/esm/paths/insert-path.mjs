'use client';
import { getPath } from './get-path.mjs';
import { setPath } from './set-path.mjs';

function insertPath(path, value, index, values) {
  const currentValue = getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  const cloned = [...currentValue];
  cloned.splice(typeof index === "number" ? index : cloned.length, 0, value);
  return setPath(path, cloned, values);
}

export { insertPath };
//# sourceMappingURL=insert-path.mjs.map
