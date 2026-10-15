'use client';
function reorderErrors(path, { from, to }, errors) {
  const oldKeyStart = `${path}.${from}`;
  const newKeyStart = `${path}.${to}`;
  const clone = { ...errors };
  const processedKeys = /* @__PURE__ */ new Set();
  Object.keys(errors).forEach((key) => {
    if (processedKeys.has(key)) {
      return;
    }
    let oldKey;
    let newKey;
    if (key.startsWith(oldKeyStart)) {
      oldKey = key;
      newKey = key.replace(oldKeyStart, newKeyStart);
    } else if (key.startsWith(newKeyStart)) {
      oldKey = key.replace(newKeyStart, oldKeyStart);
      newKey = key;
    }
    if (oldKey && newKey) {
      const value1 = clone[oldKey];
      const value2 = clone[newKey];
      value2 === void 0 ? delete clone[oldKey] : clone[oldKey] = value2;
      value1 === void 0 ? delete clone[newKey] : clone[newKey] = value1;
      processedKeys.add(oldKey);
      processedKeys.add(newKey);
    }
  });
  return clone;
}

export { reorderErrors };
//# sourceMappingURL=reorder-errors.mjs.map
