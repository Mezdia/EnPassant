'use client';
function getDataPath(formName, fieldPath) {
  return formName ? `${formName}-${fieldPath.toString()}` : fieldPath.toString();
}

export { getDataPath };
//# sourceMappingURL=get-data-path.mjs.map
