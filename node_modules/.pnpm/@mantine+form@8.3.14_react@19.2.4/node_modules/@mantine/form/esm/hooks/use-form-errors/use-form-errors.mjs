'use client';
import { useState, useRef, useCallback } from 'react';
import { filterErrors } from './filter-errors/filter-errors.mjs';

function useFormErrors(initialErrors) {
  const [errorsState, setErrorsState] = useState(filterErrors(initialErrors));
  const errorsRef = useRef(errorsState);
  const setErrors = useCallback((errors) => {
    setErrorsState((current) => {
      const newErrors = filterErrors(typeof errors === "function" ? errors(current) : errors);
      errorsRef.current = newErrors;
      return newErrors;
    });
  }, []);
  const clearErrors = useCallback(() => setErrors({}), []);
  const clearFieldError = useCallback(
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
  const setFieldError = useCallback(
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

export { useFormErrors };
//# sourceMappingURL=use-form-errors.mjs.map
