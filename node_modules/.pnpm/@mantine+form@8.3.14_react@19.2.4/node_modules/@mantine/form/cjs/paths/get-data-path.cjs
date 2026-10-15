'use client';
'use strict';

function getDataPath(formName, fieldPath) {
  return formName ? `${formName}-${fieldPath.toString()}` : fieldPath.toString();
}

exports.getDataPath = getDataPath;
//# sourceMappingURL=get-data-path.cjs.map
