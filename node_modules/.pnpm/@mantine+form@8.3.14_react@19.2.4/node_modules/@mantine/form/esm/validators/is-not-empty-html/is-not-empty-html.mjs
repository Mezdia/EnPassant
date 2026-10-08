'use client';
function removeHtmlTags(input) {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}
function isNotEmptyHTML(error) {
  const _error = error || true;
  return (value) => {
    if (typeof value === "string") {
      return removeHtmlTags(value).trim().length > 0 ? null : _error;
    }
    return _error;
  };
}

export { isNotEmptyHTML };
//# sourceMappingURL=is-not-empty-html.mjs.map
