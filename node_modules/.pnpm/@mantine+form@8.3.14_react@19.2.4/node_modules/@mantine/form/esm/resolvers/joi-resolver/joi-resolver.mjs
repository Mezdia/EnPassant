'use client';
function joiResolver(schema, options) {
  const _schema = schema;
  return (values) => {
    const parsed = _schema.validate(values, { abortEarly: false, ...options });
    if (!parsed.error) {
      return {};
    }
    const results = {};
    parsed.error.details.forEach((error) => {
      results[error.path.join(".")] = error.message;
    });
    return results;
  };
}

export { joiResolver };
//# sourceMappingURL=joi-resolver.mjs.map
