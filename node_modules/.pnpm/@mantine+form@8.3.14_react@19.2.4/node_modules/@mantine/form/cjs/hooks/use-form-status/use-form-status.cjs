'use client';
'use strict';

var react = require('react');
var isEqual = require('fast-deep-equal');
var getStatus = require('../../get-status/get-status.cjs');
var clearListState = require('../../lists/clear-list-state.cjs');
var getPath = require('../../paths/get-path.cjs');
require('klona/full');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var isEqual__default = /*#__PURE__*/_interopDefault(isEqual);

function useFormStatus({
  initialDirty,
  initialTouched,
  mode,
  $values
}) {
  const [touchedState, setTouchedState] = react.useState(initialTouched);
  const [dirtyState, setDirtyState] = react.useState(initialDirty);
  const touchedRef = react.useRef(initialTouched);
  const dirtyRef = react.useRef(initialDirty);
  const setTouched = react.useCallback((values) => {
    const resolvedValues = typeof values === "function" ? values(touchedRef.current) : values;
    touchedRef.current = resolvedValues;
    if (mode === "controlled") {
      setTouchedState(resolvedValues);
    }
  }, []);
  const setDirty = react.useCallback(
    (values, forceUpdate = false) => {
      const resolvedValues = typeof values === "function" ? values(dirtyRef.current) : values;
      dirtyRef.current = resolvedValues;
      if (mode === "controlled" || forceUpdate) {
        setDirtyState(resolvedValues);
      }
    },
    []
  );
  const resetTouched = react.useCallback(() => setTouched({}), []);
  const resetDirty = react.useCallback((values) => {
    const newSnapshot = values ? { ...$values.refValues.current, ...values } : $values.refValues.current;
    $values.setValuesSnapshot(newSnapshot);
    setDirty({});
  }, []);
  const setFieldTouched = react.useCallback((path, touched) => {
    setTouched((currentTouched) => {
      if (getStatus.getStatus(currentTouched, path) === touched) {
        return currentTouched;
      }
      return { ...currentTouched, [path]: touched };
    });
  }, []);
  const setFieldDirty = react.useCallback((path, dirty, forceUpdate) => {
    setDirty((currentDirty) => {
      if (getStatus.getStatus(currentDirty, path) === dirty) {
        return currentDirty;
      }
      return { ...currentDirty, [path]: dirty };
    }, forceUpdate);
  }, []);
  const setCalculatedFieldDirty = react.useCallback((path, value) => {
    const currentDirty = getStatus.getStatus(dirtyRef.current, path);
    const dirty = !isEqual__default.default(getPath.getPath(path, $values.getValuesSnapshot()), value);
    const clearedState = clearListState.clearListState(path, dirtyRef.current);
    clearedState[path] = dirty;
    setDirty(clearedState, currentDirty !== dirty);
  }, []);
  const isTouched = react.useCallback(
    (path) => getStatus.getStatus(touchedRef.current, path),
    []
  );
  const clearFieldDirty = react.useCallback(
    (path) => setDirty((current) => {
      if (typeof path !== "string") {
        return current;
      }
      const result = clearListState.clearListState(path, current);
      delete result[path];
      if (isEqual__default.default(result, current)) {
        return current;
      }
      return result;
    }),
    []
  );
  const isDirty = react.useCallback((path) => {
    if (path) {
      const overriddenValue = getPath.getPath(path, dirtyRef.current);
      if (typeof overriddenValue === "boolean") {
        return overriddenValue;
      }
      const sliceOfValues = getPath.getPath(path, $values.refValues.current);
      const sliceOfInitialValues = getPath.getPath(path, $values.valuesSnapshot.current);
      return !isEqual__default.default(sliceOfValues, sliceOfInitialValues);
    }
    const isOverridden = Object.keys(dirtyRef.current).length > 0;
    if (isOverridden) {
      return getStatus.getStatus(dirtyRef.current);
    }
    return !isEqual__default.default($values.refValues.current, $values.valuesSnapshot.current);
  }, []);
  const getDirty = react.useCallback(() => dirtyRef.current, []);
  const getTouched = react.useCallback(() => touchedRef.current, []);
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

exports.useFormStatus = useFormStatus;
//# sourceMappingURL=use-form-status.cjs.map
