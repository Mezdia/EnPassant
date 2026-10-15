'use client';
import { getPath } from './get-path.mjs';
import { setPath } from './set-path.mjs';

function replacePath(path, item, index, values) {
  const currentValue = getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  if (currentValue.length <= index) {
    return values;
  }
  const cloned = [...currentValue];
  cloned[index] = item;
  return setPath(path, cloned, values);
}

export { replacePath };
//# sourceMappingURL=replace-path.mjs.map
