'use client';
import { getPath } from './get-path.mjs';
import { setPath } from './set-path.mjs';

function reorderPath(path, { from, to }, values) {
  const currentValue = getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  const cloned = [...currentValue];
  const item = currentValue[from];
  cloned.splice(from, 1);
  cloned.splice(to, 0, item);
  return setPath(path, cloned, values);
}

export { reorderPath };
//# sourceMappingURL=reorder-path.mjs.map
