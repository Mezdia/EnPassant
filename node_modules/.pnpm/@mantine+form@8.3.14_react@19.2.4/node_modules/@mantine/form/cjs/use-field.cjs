'use client';
'use strict';

var react = require('react');
var getInputOnChange = require('./get-input-on-change/get-input-on-change.cjs');
require('klona/full');
var shouldValidateOnChange = require('./validate/should-validate-on-change.cjs');

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
  const [valueState, setValueState] = react.useState(initialValue);
  const valueRef = react.useRef(valueState);
  const [key, setKey] = react.useState(0);
  const [error, setError] = react.useState(initialError || null);
  const touchedRef = react.useRef(initialTouched || false);
  const [, setTouchedState] = react.useState(touchedRef.current);
  const [isValidating, setIsValidating] = react.useState(false);
  const errorResolver = react.useMemo(
    () => resolveValidationError || ((err) => err),
    [resolveValidationError]
  );
  const setTouched = react.useCallback((val, { updateState = mode === "controlled" } = {}) => {
    touchedRef.current = val;
    updateState && setTouchedState(val);
  }, []);
  const setValue = react.useCallback(
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
  const reset = react.useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);
  const getValue = react.useCallback(() => valueRef.current, []);
  const isTouched = react.useCallback(() => touchedRef.current, []);
  const isDirty = react.useCallback(() => valueRef.current !== initialValue, [initialValue]);
  const _validate = react.useCallback(async () => {
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
    const onChange = getInputOnChange.getInputOnChange((val) => setValue(val, { updateKey: false }));
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
        if (shouldValidateOnChange.shouldValidateOnChange("", !!validateOnBlur)) {
          _validate();
        }
      };
    }
    return payload;
  };
  const resetTouched = react.useCallback(() => setTouched(false), []);
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

exports.useField = useField;
//# sourceMappingURL=use-field.cjs.map
