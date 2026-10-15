'use client';
'use strict';

function matches(regexp, error) {
  const _error = error || true;
  return (value) => {
    if (typeof value !== "string") {
      return _error;
    }
    return regexp.test(value) ? null : _error;
  };
}

exports.matches = matches;
//# sourceMappingURL=matches.cjs.map
