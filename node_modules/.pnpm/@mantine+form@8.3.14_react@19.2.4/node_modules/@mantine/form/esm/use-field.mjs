'use client';
import { useState, useRef, useMemo, useCallback } from 'react';
import { getInputOnChange } from './get-input-on-change/get-input-on-change.mjs';
import 'klona/full';
import { shouldValidateOnChange } from './validate/should-validate-on-change.mjs';

function useField({
  mode = "controlled",
  clearErrorOnChange = true,
  initialValue,
  initialError = null,
  initialTouched = false,
  onValueChange,
  validateOnChange = false,
  validateOnBlur = false,
  validate,
  resolveValidationError,
  type = "input"
}) {
  const [valueState, setValueState] = useState(initialValue);
  const valueRef = useRef(valueState);
  const [key, setKey] = useState(0);
  const [error, setError] = useState(initialError || null);
  const touchedRef = useRef(initialTouched || false);
  const [, setTouchedState] = useState(touchedRef.current);
  const [isValidating, setIsValidating] = useState(false);
  const errorResolver = useMemo(
    () => resolveValidationError || ((err) => err),
    [resolveValidationError]
  );
  const setTouched = useCallback((val, { updateState = mode === "controlled" } = {}) => {
    touchedRef.current = val;
    updateState && setTouchedState(val);
  }, []);
  const setValue = useCallback(
    (value, {
      updateKey = mode === "uncontrolled",
      updateState = mode === "controlled"
    } = {}) => {
      if (valueRef.current === value) {
        return;
      }
      valueRef.current = value;
      onValueChange?.(value);
      if (clearErrorOnChange && error !== null) {
        setError(null);
      }
      if (updateState) {
        setValueState(value);
      }
      if (updateKey) {
        setKey((currentKey) => currentKey + 1);
      }
      if (validateOnChange) {
        _validate();
      }
    },
    [error, clearErrorOnChange, onValueChange]
  );
  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);
  const getValue = useCallback(() => valueRef.current, []);
  const isTouched = useCallback(() => touchedRef.current, []);
  const isDirty = useCallback(() => valueRef.current !== initialValue, [initialValue]);
  const _validate = useCallback(async () => {
    const validationResult = validate?.(valueRef.current);
    if (validationResult instanceof Promise) {
      setIsValidating(true);
      try {
        const result = await validationResult;
        setIsValidating(false);
        setError(result);
      } catch (err) {
        setIsValidating(false);
        const resolvedError = errorResolver(err);
        setError(resolvedError);
        return resolvedError;
      }
    } else {
      setError(validationResult);
      return validationResult;
    }
  }, []);
  const getInputProps = ({ withError = true, withFocus = true } = {}) => {
    const onChange = getInputOnChange((val) => setValue(val, { updateKey: false }));
    const payload = { onChange };
    if (withError) {
      payload.error = error;
    }
    if (type === "checkbox") {
      payload[mode === "controlled" ? "checked" : "defaultChecked"] = valueRef.current;
    } else {
      payload[mode === "controlled" ? "value" : "defaultValue"] = valueRef.current;
    }
    if (withFocus) {
      payload.onFocus = () => {
        setTouched(true);
      };
      payload.onBlur = () => {
        if (shouldValidateOnChange("", !!validateOnBlur)) {
          _validate();
        }
      };
    }
    return payload;
  };
  const resetTouched = useCallback(() => setTouched(false), []);
  return {
    key,
    getValue,
    setValue,
    reset,
    getInputProps,
    isValidating,
    validate: _validate,
    error,
    setError,
    isTouched,
    isDirty,
    resetTouched
  };
}

export { useField };
//# sourceMappingURL=use-field.mjs.map
