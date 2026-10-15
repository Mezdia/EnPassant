'use client';
import { useState, useRef, useCallback } from 'react';
import isEqual from 'fast-deep-equal';
import { getStatus } from '../../get-status/get-status.mjs';
import { clearListState } from '../../lists/clear-list-state.mjs';
import { getPath } from '../../paths/get-path.mjs';
import 'klona/full';

function useFormStatus({
  initialDirty,
  initialTouched,
  mode,
  $values
}) {
  const [touchedState, setTouchedState] = useState(initialTouched);
  const [dirtyState, setDirtyState] = useState(initialDirty);
  const touchedRef = useRef(initialTouched);
  const dirtyRef = useRef(initialDirty);
  const setTouched = useCallback((values) => {
    const resolvedValues = typeof values === "function" ? values(touchedRef.current) : values;
    touchedRef.current = resolvedValues;
    if (mode === "controlled") {
      setTouchedState(resolvedValues);
    }
  }, []);
  const setDirty = useCallback(
    (values, forceUpdate = false) => {
      const resolvedValues = typeof values === "function" ? values(dirtyRef.current) : values;
      dirtyRef.current = resolvedValues;
      if (mode === "controlled" || forceUpdate) {
        setDirtyState(resolvedValues);
      }
    },
    []
  );
  const resetTouched = useCallback(() => setTouched({}), []);
  const resetDirty = useCallback((values) => {
    const newSnapshot = values ? { ...$values.refValues.current, ...values } : $values.refValues.current;
    $values.setValuesSnapshot(newSnapshot);
    setDirty({});
  }, []);
  const setFieldTouched = useCallback((path, touched) => {
    setTouched((currentTouched) => {
      if (getStatus(currentTouched, path) === touched) {
        return currentTouched;
      }
      return { ...currentTouched, [path]: touched };
    });
  }, []);
  const setFieldDirty = useCallback((path, dirty, forceUpdate) => {
    setDirty((currentDirty) => {
      if (getStatus(currentDirty, path) === dirty) {
        return currentDirty;
      }
      return { ...currentDirty, [path]: dirty };
    }, forceUpdate);
  }, []);
  const setCalculatedFieldDirty = useCallback((path, value) => {
    const currentDirty = getStatus(dirtyRef.current, path);
    const dirty = !isEqual(getPath(path, $values.getValuesSnapshot()), value);
    const clearedState = clearListState(path, dirtyRef.current);
    clearedState[path] = dirty;
    setDirty(clearedState, currentDirty !== dirty);
  }, []);
  const isTouched = useCallback(
    (path) => getStatus(touchedRef.current, path),
    []
  );
  const clearFieldDirty = useCallback(
    (path) => setDirty((current) => {
      if (typeof path !== "string") {
        return current;
      }
      const result = clearListState(path, current);
      delete result[path];
      if (isEqual(result, current)) {
        return current;
      }
      return result;
    }),
    []
  );
  const isDirty = useCallback((path) => {
    if (path) {
      const overriddenValue = getPath(path, dirtyRef.current);
      if (typeof overriddenValue === "boolean") {
        return overriddenValue;
      }
      const sliceOfValues = getPath(path, $values.refValues.current);
      const sliceOfInitialValues = getPath(path, $values.valuesSnapshot.current);
      return !isEqual(sliceOfValues, sliceOfInitialValues);
    }
    const isOverridden = Object.keys(dirtyRef.current).length > 0;
    if (isOverridden) {
      return getStatus(dirtyRef.current);
    }
    return !isEqual($values.refValues.current, $values.valuesSnapshot.current);
  }, []);
  const getDirty = useCallback(() => dirtyRef.current, []);
  const getTouched = useCallback(() => touchedRef.current, []);
  return {
    touchedState,
    dirtyState,
    touchedRef,
    dirtyRef,
    setTouched,
    setDirty,
    resetDirty,
    resetTouched,
    isTouched,
    setFieldTouched,
    setFieldDirty,
    setTouchedState,
    setDirtyState,
    clearFieldDirty,
    isDirty,
    getDirty,
    getTouched,
    setCalculatedFieldDirty
  };
}

export { useFormStatus };
//# sourceMappingURL=use-form-status.mjs.map
