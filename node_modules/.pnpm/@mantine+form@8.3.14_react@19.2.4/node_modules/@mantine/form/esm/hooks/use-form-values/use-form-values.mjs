'use client';
import { useRef, useState, useCallback } from 'react';
import { getPath } from '../../paths/get-path.mjs';
import { setPath } from '../../paths/set-path.mjs';

function useFormValues({
  initialValues,
  onValuesChange,
  mode
}) {
  const initialized = useRef(false);
  const [stateValues, setStateValues] = useState(initialValues || {});
  const refValues = useRef(stateValues);
  const valuesSnapshot = useRef(stateValues);
  const setValues = useCallback(
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
  const setFieldValue = useCallback(
    (payload) => {
      const currentValue = getPath(payload.path, refValues.current);
      const updatedValue = payload.value instanceof Function ? payload.value(currentValue) : payload.value;
      if (currentValue !== updatedValue) {
        const previousValues = refValues.current;
        const updatedValues = setPath(payload.path, updatedValue, refValues.current);
        setValues({ values: updatedValues, updateState: payload.updateState });
        payload.subscribers?.filter(Boolean).forEach(
          (subscriber) => subscriber({ path: payload.path, updatedValues, previousValues })
        );
      }
    },
    [setValues]
  );
  const setValuesSnapshot = useCallback((payload) => {
    valuesSnapshot.current = payload;
  }, []);
  const initialize = useCallback(
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
  const resetValues = useCallback(() => {
    setValues({
      values: valuesSnapshot.current,
      updateState: true,
      mergeWithPreviousValues: false
    });
  }, [setValues]);
  const getValues = useCallback(() => refValues.current, []);
  const getValuesSnapshot = useCallback(() => valuesSnapshot.current, []);
  const resetField = useCallback(
    (path, subscribers) => {
      const snapshotValue = getPath(path, valuesSnapshot.current);
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

export { useFormValues };
//# sourceMappingURL=use-form-values.mjs.map
