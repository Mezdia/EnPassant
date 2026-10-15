'use client';
'use strict';

var react = require('react');
var changeErrorIndices = require('../../lists/change-error-indices.cjs');
var reorderErrors = require('../../lists/reorder-errors.cjs');
require('klona/full');
var reorderPath = require('../../paths/reorder-path.cjs');
var insertPath = require('../../paths/insert-path.cjs');
var removePath = require('../../paths/remove-path.cjs');
var replacePath = require('../../paths/replace-path.cjs');

function useFormList({
  $values,
  $errors,
  $status
}) {
  const reorderListItem = react.useCallback((path, payload) => {
    $status.clearFieldDirty(path);
    $errors.setErrors((errs) => reorderErrors.reorderErrors(path, payload, errs));
    $values.setValues({
      values: reorderPath.reorderPath(path, payload, $values.refValues.current),
      updateState: true
    });
  }, []);
  const removeListItem = react.useCallback((path, index) => {
    $status.clearFieldDirty(path);
    $errors.setErrors((errs) => changeErrorIndices.changeErrorIndices(path, index, errs, -1));
    $values.setValues({
      values: removePath.removePath(path, index, $values.refValues.current),
      updateState: true
    });
  }, []);
  const insertListItem = react.useCallback((path, item, index) => {
    $status.clearFieldDirty(path);
    $errors.setErrors((errs) => changeErrorIndices.changeErrorIndices(path, index, errs, 1));
    $values.setValues({
      values: insertPath.insertPath(path, item, index, $values.refValues.current),
      updateState: true
    });
  }, []);
  const replaceListItem = react.useCallback((path, index, item) => {
    $status.clearFieldDirty(path);
    $values.setValues({
      values: replacePath.replacePath(path, item, index, $values.refValues.current),
      updateState: true
    });
  }, []);
  return { reorderListItem, removeListItem, insertListItem, replaceListItem };
}

exports.useFormList = useFormList;
//# sourceMappingURL=use-form-list.cjs.map
