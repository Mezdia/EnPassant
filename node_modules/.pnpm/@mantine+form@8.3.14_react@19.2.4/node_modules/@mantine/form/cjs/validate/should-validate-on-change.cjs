'use client';
'use strict';

var formIndex = require('../form-index.cjs');

function shouldValidateOnChange(path, validateInputOnChange) {
  if (!validateInputOnChange) {
    return false;
  }
  if (typeof validateInputOnChange === "boolean") {
    return validateInputOnChange;
  }
  if (Array.isArray(validateInputOnChange)) {
    return validateInputOnChange.includes(path.replace(/[.][0-9]+/g, `.${formIndex.FORM_INDEX}`));
  }
  return false;
}

exports.shouldValidateOnChange = shouldValidateOnChange;
//# sourceMappingURL=should-validate-on-change.cjs.map
