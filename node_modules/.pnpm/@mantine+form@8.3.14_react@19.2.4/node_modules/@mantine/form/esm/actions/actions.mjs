'use client';
import { useLayoutEffect, useEffect } from 'react';

function dispatchEvent(type, detail) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}
function validateFormName(name) {
  if (!/^[0-9a-zA-Z-]+$/.test(name)) {
    throw new Error(
      `[@mantine/use-form] Form name "${name}" is invalid, it should contain only letters, numbers and dashes`
    );
  }
}
const useIsomorphicEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
function createFormActions(name) {
  validateFormName(name);
  const setFieldValue = (path, value) => dispatchEvent(`mantine-form:${name}:set-field-value`, { path, value });
  const setValues = (values) => dispatchEvent(`mantine-form:${name}:set-values`, values);
  const setInitialValues = (values) => dispatchEvent(`mantine-form:${name}:set-initial-values`, values);
  const setErrors = (errors) => dispatchEvent(`mantine-form:${name}:set-errors`, errors);
  const setFieldError = (path, error) => dispatchEvent(`mantine-form:${name}:set-field-error`, { path, error });
  const clearFieldError = (path) => dispatchEvent(`mantine-form:${name}:clear-field-error`, path);
  const clearErrors = () => dispatchEvent(`mantine-form:${name}:clear-errors`);
  const reset = () => dispatchEvent(`mantine-form:${name}:reset`);
  const validate = () => dispatchEvent(`mantine-form:${name}:validate`);
  const validateField = (path) => dispatchEvent(`mantine-form:${name}:validate-field`, path);
  const reorderListItem = (path, payload) => dispatchEvent(`mantine-form:${name}:reorder-list-item`, { path, payload });
  const removeListItem = (path, index) => dispatchEvent(`mantine-form:${name}:remove-list-item`, { path, index });
  const insertListItem = (path, item, index) => dispatchEvent(`mantine-form:${name}:insert-list-item`, { path, index, item });
  const setDirty = (value) => dispatchEvent(`mantine-form:${name}:set-dirty`, value);
  const setTouched = (value) => dispatchEvent(`mantine-form:${name}:set-touched`, value);
  const resetDirty = (values) => dispatchEvent(`mantine-form:${name}:reset-dirty`, values);
  const resetTouched = () => dispatchEvent(`mantine-form:${name}:reset-touched`);
  return {
    setFieldValue,
    setValues,
    setInitialValues,
    setErrors,
    setFieldError,
    clearFieldError,
    clearErrors,
    reset,
    validate,
    validateField,
    reorderListItem,
    removeListItem,
    insertListItem,
    setDirty,
    setTouched,
    resetDirty,
    resetTouched
  };
}
function useFormEvent(eventKey, handler) {
  useIsomorphicEffect(() => {
    if (eventKey) {
      window.addEventListener(eventKey, handler);
      return () => window.removeEventListener(eventKey, handler);
    }
    return void 0;
  }, [eventKey]);
}
function useFormActions(name, form) {
  if (name) {
    validateFormName(name);
  }
  useFormEvent(
    `mantine-form:${name}:set-field-value`,
    (event) => form.setFieldValue(event.detail.path, event.detail.value)
  );
  useFormEvent(
    `mantine-form:${name}:set-values`,
    (event) => form.setValues(event.detail)
  );
  useFormEvent(
    `mantine-form:${name}:set-initial-values`,
    (event) => form.setInitialValues(event.detail)
  );
  useFormEvent(
    `mantine-form:${name}:set-errors`,
    (event) => form.setErrors(event.detail)
  );
  useFormEvent(
    `mantine-form:${name}:set-field-error`,
    (event) => form.setFieldError(event.detail.path, event.detail.error)
  );
  useFormEvent(
    `mantine-form:${name}:clear-field-error`,
    (event) => form.clearFieldError(event.detail)
  );
  useFormEvent(`mantine-form:${name}:clear-errors`, form.clearErrors);
  useFormEvent(`mantine-form:${name}:reset`, form.reset);
  useFormEvent(`mantine-form:${name}:validate`, form.validate);
  useFormEvent(
    `mantine-form:${name}:validate-field`,
    (event) => form.validateField(event.detail)
  );
  useFormEvent(
    `mantine-form:${name}:reorder-list-item`,
    (event) => form.reorderListItem(event.detail.path, event.detail.payload)
  );
  useFormEvent(
    `mantine-form:${name}:remove-list-item`,
    (event) => form.removeListItem(event.detail.path, event.detail.index)
  );
  useFormEvent(
    `mantine-form:${name}:insert-list-item`,
    (event) => form.insertListItem(event.detail.path, event.detail.item, event.detail.index)
  );
  useFormEvent(
    `mantine-form:${name}:set-dirty`,
    (event) => form.setDirty(event.detail)
  );
  useFormEvent(
    `mantine-form:${name}:set-touched`,
    (event) => form.setTouched(event.detail)
  );
  useFormEvent(
    `mantine-form:${name}:reset-dirty`,
    (event) => form.resetDirty(event.detail)
  );
  useFormEvent(`mantine-form:${name}:reset-touched`, form.resetTouched);
}

export { createFormActions, useFormActions, useIsomorphicEffect };
//# sourceMappingURL=actions.mjs.map
