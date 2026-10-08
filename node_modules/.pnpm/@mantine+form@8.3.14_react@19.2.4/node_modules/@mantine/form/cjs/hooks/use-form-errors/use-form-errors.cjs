'use client';
'use strict';

var react = require('react');
var filterErrors = require('./filter-errors/filter-errors.cjs');

function useFormErrors(initialErrors) {
  const [errorsState, setErrorsState] = react.useState(filterErrors.filterErrors(initialErrors));
  const errorsRef = react.useRef(errorsState);
  const setErrors = react.useCallback((errors) => {
    setErrorsState((current) => {
      const newErrors = filterErrors.filterErrors(typeof errors === "function" ? errors(current) : errors);
      errorsRef.current = newErrors;
      return newErrors;
    });
  }, []);
  const clearErrors = react.useCallback(() => setErrors({}), []);
  const clearFieldError = react.useCallback(
    (path) => {
      if (errorsRef.current[path] === void 0) {
        return;
      }
      setErrors((current) => {
        const errors = { ...current };
        delete errors[path];
        return errors;
      });
    },
    [errorsState]
  );
  const setFieldError = react.useCallback(
    (path, error) => {
      if (error == null || error === false) {
        clearFieldError(path);
      } else if (errorsRef.current[path] !== error) {
        setErrors((current) => ({ ...current, [path]: error }));
      }
    },
    [errorsState]
  );
  return {
    errorsState,
    setErrors,
    clearErrors,
    setFieldError,
    clearFieldError
  };
}

exports.useFormErrors = useFormErrors;
//# sourceMappingURL=use-form-errors.cjs.map
