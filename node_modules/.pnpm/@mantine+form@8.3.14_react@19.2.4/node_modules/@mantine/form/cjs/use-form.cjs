'use client';
'use strict';

var react = require('react');
var actions = require('./actions/actions.cjs');
var getInputOnChange = require('./get-input-on-change/get-input-on-change.cjs');
var useFormErrors = require('./hooks/use-form-errors/use-form-errors.cjs');
var useFormList = require('./hooks/use-form-list/use-form-list.cjs');
var useFormStatus = require('./hooks/use-form-status/use-form-status.cjs');
var useFormValues = require('./hooks/use-form-values/use-form-values.cjs');
var useFormWatch = require('./hooks/use-form-watch/use-form-watch.cjs');
var getPath = require('./paths/get-path.cjs');
require('klona/full');
var getDataPath = require('./paths/get-data-path.cjs');
var validateValues = require('./validate/validate-values.cjs');
var validateFieldValue = require('./validate/validate-field-value.cjs');
var shouldValidateOnChange = require('./validate/should-validate-on-change.cjs');

function useForm({
  name,
  mode = "controlled",
  initialValues,
  initialErrors = {},
  initialDirty = {},
  initialTouched = {},
  clearInputErrorOnChange = true,
  validateInputOnChange = false,
  validateInputOnBlur = false,
  onValuesChange,
  transformValues = ((values) => values),
  enhanceGetInputProps,
  validate: rules,
  onSubmitPreventDefault = "always",
  touchTrigger = "change",
  cascadeUpdates = false
} = {}) {
  const $errors = useFormErrors.useFormErrors(initialErrors);
  const $values = useFormValues.useFormValues({ initialValues, onValuesChange, mode });
  const $status = useFormStatus.useFormStatus({ initialDirty, initialTouched, $values, mode });
  const $list = useFormList.useFormList({ $values, $errors, $status });
  const $watch = useFormWatch.useFormWatch({ $status, cascadeUpdates });
  const [formKey, setFormKey] = react.useState(0);
  const [fieldKeys, setFieldKeys] = react.useState({});
  const [submitting, setSubmitting] = react.useState(false);
  const reset = react.useCallback(() => {
    $values.resetValues();
    $errors.clearErrors();
    $status.resetDirty();
    $status.resetTouched();
    mode === "uncontrolled" && setFormKey((key2) => key2 + 1);
  }, []);
  const handleValuesChanges = react.useCallback(
    (previousValues) => {
      clearInputErrorOnChange && $errors.clearErrors();
      mode === "uncontrolled" && setFormKey((key2) => key2 + 1);
      Object.keys($watch.subscribers.current).forEach((path) => {
        const value = getPath.getPath(path, $values.refValues.current);
        const previousValue = getPath.getPath(path, previousValues);
        if (value !== previousValue) {
          $watch.getFieldSubscribers(path).forEach((cb) => cb({ previousValues, updatedValues: $values.refValues.current }));
        }
      });
    },
    [clearInputErrorOnChange]
  );
  const initialize = react.useCallback(
    (values) => {
      const previousValues = $values.refValues.current;
      $values.initialize(values, () => mode === "uncontrolled" && setFormKey((key2) => key2 + 1));
      handleValuesChanges(previousValues);
    },
    [handleValuesChanges]
  );
  const setFieldValue = react.useCallback(
    (path, value, options) => {
      const shouldValidate = shouldValidateOnChange.shouldValidateOnChange(path, validateInputOnChange);
      const resolvedValue = value instanceof Function ? value(getPath.getPath(path, $values.refValues.current)) : value;
      $status.setCalculatedFieldDirty(path, resolvedValue);
      touchTrigger === "change" && $status.setFieldTouched(path, true);
      !shouldValidate && clearInputErrorOnChange && $errors.clearFieldError(path);
      $values.setFieldValue({
        path,
        value,
        updateState: mode === "controlled",
        subscribers: [
          ...$watch.getFieldSubscribers(path),
          shouldValidate ? (payload) => {
            const validationResults = validateFieldValue.validateFieldValue(path, rules, payload.updatedValues);
            validationResults.hasError ? $errors.setFieldError(path, validationResults.error) : $errors.clearFieldError(path);
          } : null,
          options?.forceUpdate !== false && mode !== "controlled" ? () => setFieldKeys((keys) => ({
            ...keys,
            [path]: (keys[path] || 0) + 1
          })) : null
        ]
      });
    },
    [onValuesChange, rules]
  );
  const setValues = react.useCallback(
    (values) => {
      const previousValues = $values.refValues.current;
      $values.setValues({ values, updateState: mode === "controlled" });
      handleValuesChanges(previousValues);
    },
    [onValuesChange, handleValuesChanges]
  );
  const validate = react.useCallback(() => {
    const results = validateValues.validateValues(rules, $values.refValues.current);
    $errors.setErrors(results.errors);
    return results;
  }, [rules]);
  const validateField = react.useCallback(
    (path) => {
      const results = validateFieldValue.validateFieldValue(path, rules, $values.refValues.current);
      results.hasError ? $errors.setFieldError(path, results.error) : $errors.clearFieldError(path);
      return results;
    },
    [rules]
  );
  const getInputProps = (path, { type = "input", withError = true, withFocus = true, ...otherOptions } = {}) => {
    const onChange = getInputOnChange.getInputOnChange(
      (value) => setFieldValue(path, value, { forceUpdate: false })
    );
    const payload = { onChange, "data-path": getDataPath.getDataPath(name, path) };
    if (withError) {
      payload.error = $errors.errorsState[path];
    }
    if (type === "checkbox") {
      payload[mode === "controlled" ? "checked" : "defaultChecked"] = getPath.getPath(
        path,
        $values.refValues.current
      );
    } else {
      payload[mode === "controlled" ? "value" : "defaultValue"] = getPath.getPath(
        path,
        $values.refValues.current
      );
    }
    if (withFocus) {
      payload.onFocus = () => $status.setFieldTouched(path, true);
      payload.onBlur = () => {
        if (shouldValidateOnChange.shouldValidateOnChange(path, validateInputOnBlur)) {
          const validationResults = validateFieldValue.validateFieldValue(path, rules, $values.refValues.current);
          validationResults.hasError ? $errors.setFieldError(path, validationResults.error) : $errors.clearFieldError(path);
        }
      };
    }
    return Object.assign(
      payload,
      enhanceGetInputProps?.({
        inputProps: payload,
        field: path,
        options: { type, withError, withFocus, ...otherOptions },
        form
      })
    );
  };
  const onSubmit = (handleSubmit, handleValidationFailure) => (event) => {
    if (onSubmitPreventDefault === "always") {
      event?.preventDefault();
    }
    const results = validate();
    if (results.hasErrors) {
      if (onSubmitPreventDefault === "validation-failed") {
        event?.preventDefault();
      }
      handleValidationFailure?.(results.errors, $values.refValues.current, event);
    } else {
      const submitResult = handleSubmit?.(
        transformValues($values.refValues.current),
        event
      );
      if (submitResult instanceof Promise) {
        setSubmitting(true);
        submitResult.finally(() => setSubmitting(false));
      }
    }
  };
  const getTransformedValues = (input) => transformValues(input || $values.refValues.current);
  const onReset = react.useCallback((event) => {
    event.preventDefault();
    reset();
  }, []);
  const isValid = react.useCallback(
    (path) => path ? !validateFieldValue.validateFieldValue(path, rules, $values.refValues.current).hasError : !validateValues.validateValues(rules, $values.refValues.current).hasErrors,
    [rules]
  );
  const key = (path) => `${formKey}-${String(path)}-${fieldKeys[String(path)] || 0}`;
  const getInputNode = react.useCallback(
    (path) => document.querySelector(`[data-path="${getDataPath.getDataPath(name, path)}"]`),
    []
  );
  const resetField = react.useCallback(
    (path) => {
      $values.resetField(path, [
        mode !== "controlled" ? () => setFieldKeys((keys) => ({
          ...keys,
          [path]: (keys[path] || 0) + 1
        })) : null
      ]);
    },
    [$values.resetField, mode, setFieldKeys]
  );
  const form = {
    watch: $watch.watch,
    initialized: $values.initialized.current,
    values: mode === "uncontrolled" ? $values.refValues.current : $values.stateValues,
    getValues: $values.getValues,
    getInitialValues: $values.getValuesSnapshot,
    setInitialValues: $values.setValuesSnapshot,
    resetField,
    initialize,
    setValues,
    setFieldValue,
    submitting,
    setSubmitting,
    errors: $errors.errorsState,
    setErrors: $errors.setErrors,
    setFieldError: $errors.setFieldError,
    clearFieldError: $errors.clearFieldError,
    clearErrors: $errors.clearErrors,
    resetDirty: $status.resetDirty,
    setTouched: $status.setTouched,
    setDirty: $status.setDirty,
    isTouched: $status.isTouched,
    resetTouched: $status.resetTouched,
    isDirty: $status.isDirty,
    getTouched: $status.getTouched,
    getDirty: $status.getDirty,
    reorderListItem: $list.reorderListItem,
    insertListItem: $list.insertListItem,
    removeListItem: $list.removeListItem,
    replaceListItem: $list.replaceListItem,
    reset,
    validate,
    validateField,
    getInputProps,
    onSubmit,
    onReset,
    isValid,
    getTransformedValues,
    key,
    getInputNode
  };
  actions.useFormActions(name, form);
  return form;
}

exports.useForm = useForm;
//# sourceMappingURL=use-form.cjs.map
