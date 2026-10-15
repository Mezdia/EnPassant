'use client';
'use strict';

var react = require('react');
var getPath = require('../../paths/get-path.cjs');
var setPath = require('../../paths/set-path.cjs');

function useFormValues({
  initialValues,
  onValuesChange,
  mode
}) {
  const initialized = react.useRef(false);
  const [stateValues, setStateValues] = react.useState(initialValues || {});
  const refValues = react.useRef(stateValues);
  const valuesSnapshot = react.useRef(stateValues);
  const setValues = react.useCallback(
    ({
      values,
      subscribers,
      updateState = true,
      mergeWithPreviousValues = true
    }) => {
      const previousValues = refValues.current;
      const resolvedValues = values instanceof Function ? values(refValues.current) : values;
      const updatedValues = mergeWithPreviousValues ? { ...previousValues, ...resolvedValues } : resolvedValues;
      refValues.current = updatedValues;
      if (updateState) {
        setStateValues(updatedValues);
        if (mode === "uncontrolled") {
          refValues.current = updatedValues;
        }
      }
      onValuesChange?.(updatedValues, previousValues);
      subscribers?.filter(Boolean).forEach((subscriber) => subscriber({ updatedValues, previousValues }));
    },
    [onValuesChange]
  );
  const setFieldValue = react.useCallback(
    (payload) => {
      const currentValue = getPath.getPath(payload.path, refValues.current);
      const updatedValue = payload.value instanceof Function ? payload.value(currentValue) : payload.value;
      if (currentValue !== updatedValue) {
        const previousValues = refValues.current;
        const updatedValues = setPath.setPath(payload.path, updatedValue, refValues.current);
        setValues({ values: updatedValues, updateState: payload.updateState });
        payload.subscribers?.filter(Boolean).forEach(
          (subscriber) => subscriber({ path: payload.path, updatedValues, previousValues })
        );
      }
    },
    [setValues]
  );
  const setValuesSnapshot = react.useCallback((payload) => {
    valuesSnapshot.current = payload;
  }, []);
  const initialize = react.useCallback(
    (values, onInitialize) => {
      if (!initialized.current) {
        initialized.current = true;
        setValues({ values, updateState: mode === "controlled" });
        setValuesSnapshot(values);
        onInitialize();
      }
    },
    [setValues]
  );
  const resetValues = react.useCallback(() => {
    setValues({
      values: valuesSnapshot.current,
      updateState: true,
      mergeWithPreviousValues: false
    });
  }, [setValues]);
  const getValues = react.useCallback(() => refValues.current, []);
  const getValuesSnapshot = react.useCallback(() => valuesSnapshot.current, []);
  const resetField = react.useCallback(
    (path, subscribers) => {
      const snapshotValue = getPath.getPath(path, valuesSnapshot.current);
      if (typeof snapshotValue === "undefined") {
        return;
      }
      setFieldValue({
        path,
        value: snapshotValue,
        updateState: mode === "controlled",
        subscribers
      });
    },
    [setFieldValue, mode]
  );
  return {
    initialized,
    stateValues,
    refValues,
    valuesSnapshot,
    setValues,
    setFieldValue,
    resetValues,
    setValuesSnapshot,
    initialize,
    getValues,
    getValuesSnapshot,
    resetField
  };
}

exports.useFormValues = useFormValues;
//# sourceMappingURL=use-form-values.cjs.map
