'use client';
'use strict';

var validateValues = require('./validate-values.cjs');

function validateFieldValue(path, rules, values) {
  if (typeof path !== "string") {
    return { hasError: false, error: null };
  }
  const results = validateValues.validateValues(rules, values);
  const pathInError = Object.keys(results.errors).find(
    (errorKey) => path.split(".").every((pathPart, i) => pathPart === errorKey.split(".")[i])
  );
  return { hasError: !!pathInError, error: pathInError ? results.errors[pathInError] : null };
}

exports.validateFieldValue = validateFieldValue;
//# sourceMappingURL=validate-field-value.cjs.map
