'use client';
function clearListState(field, state) {
  if (state === null || typeof state !== "object") {
    return {};
  }
  const clone = { ...state };
  Object.keys(state).forEach((errorKey) => {
    if (errorKey.includes(`${String(field)}.`)) {
      delete clone[errorKey];
    }
  });
  return clone;
}

export { clearListState };
//# sourceMappingURL=clear-list-state.mjs.map
