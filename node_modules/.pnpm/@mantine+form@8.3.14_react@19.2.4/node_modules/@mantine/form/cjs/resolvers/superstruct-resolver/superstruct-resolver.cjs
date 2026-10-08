'use client';
'use strict';

function superstructResolver(schema) {
  function structValidation(values) {
    const formErrors = {};
    const [err] = schema.validate(values);
    if (!err) {
      return formErrors;
    }
    err.failures().forEach((fieldFailure) => {
      const fieldName = fieldFailure.path.join(" ");
      formErrors[fieldFailure.path.join(".")] = `${fieldName}: ${fieldFailure.message}`;
    });
    return formErrors;
  }
  return structValidation;
}

exports.superstructResolver = superstructResolver;
//# sourceMappingURL=superstruct-resolver.cjs.map
