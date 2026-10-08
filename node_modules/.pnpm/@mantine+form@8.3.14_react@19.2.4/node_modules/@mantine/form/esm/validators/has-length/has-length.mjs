'use client';
function isLengthValid(payload, value) {
  if (typeof payload === "number") {
    return value.length === payload;
  }
  const { max, min } = payload;
  let valid = true;
  if (typeof max === "number" && value.length > max) {
    valid = false;
  }
  if (typeof min === "number" && value.length < min) {
    valid = false;
  }
  return valid;
}
function hasLength(payload, error) {
  const _error = error || true;
  return (value) => {
    if (typeof value === "string") {
      return isLengthValid(payload, value.trim()) ? null : _error;
    }
    if (typeof value === "object" && value !== null && "length" in value) {
      return isLengthValid(payload, value) ? null : _error;
    }
    return _error;
  };
}

export { hasLength };
//# sourceMappingURL=has-length.mjs.map
