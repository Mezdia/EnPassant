'use client';
'use strict';

function matchesField(field, error) {
  const _error = error || true;
  return (value, values) => {
    if (!values || !(field in values)) {
      return _error;
    }
    return value === values[field] ? null : _error;
  };
}

exports.matchesField = matchesField;
//# sourceMappingURL=matches-field.cjs.map
