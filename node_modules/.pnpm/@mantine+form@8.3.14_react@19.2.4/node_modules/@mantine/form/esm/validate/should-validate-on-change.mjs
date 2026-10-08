'use client';
import { FORM_INDEX } from '../form-index.mjs';

function shouldValidateOnChange(path, validateInputOnChange) {
  if (!validateInputOnChange) {
    return false;
  }
  if (typeof validateInputOnChange === "boolean") {
    return validateInputOnChange;
  }
  if (Array.isArray(validateInputOnChange)) {
    return validateInputOnChange.includes(path.replace(/[.][0-9]+/g, `.${FORM_INDEX}`));
  }
  return false;
}

export { shouldValidateOnChange };
//# sourceMappingURL=should-validate-on-change.mjs.map
