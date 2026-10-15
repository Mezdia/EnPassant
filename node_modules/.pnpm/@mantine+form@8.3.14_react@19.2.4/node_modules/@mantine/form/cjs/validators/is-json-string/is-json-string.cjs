'use client';
'use strict';

function isJSONString(error) {
  const _error = error || true;
  return (value) => {
    if (typeof value === "string") {
      try {
        JSON.parse(value);
        return null;
      } catch (e) {
        return _error;
      }
    }
    return _error;
  };
}

exports.isJSONString = isJSONString;
//# sourceMappingURL=is-json-string.cjs.map
