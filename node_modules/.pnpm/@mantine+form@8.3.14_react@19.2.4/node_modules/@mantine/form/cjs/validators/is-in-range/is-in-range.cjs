'use client';
'use strict';

function isInRange({ min, max }, error) {
  const _error = error || true;
  return (value) => {
    if (typeof value !== "number") {
      return _error;
    }
    let valid = true;
    if (typeof min === "number" && value < min) {
      valid = false;
    }
    if (typeof max === "number" && value > max) {
      valid = false;
    }
    return valid ? null : _error;
  };
}

exports.isInRange = isInRange;
//# sourceMappingURL=is-in-range.cjs.map
