'use client';
'use strict';

function yupResolver(schema) {
  const _schema = schema;
  return (values) => {
    try {
      _schema.validateSync(values, { abortEarly: false });
      return {};
    } catch (_yupError) {
      const yupError = _yupError;
      const results = {};
      yupError.inner.forEach((error) => {
        results[error.path.replaceAll("[", ".").replaceAll("]", "")] = error.message;
      });
      return results;
    }
  };
}

exports.yupResolver = yupResolver;
//# sourceMappingURL=yup-resolver.cjs.map
