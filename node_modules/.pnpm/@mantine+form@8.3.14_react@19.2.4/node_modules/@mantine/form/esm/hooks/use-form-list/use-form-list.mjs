'use client';
import { useCallback } from 'react';
import { changeErrorIndices } from '../../lists/change-error-indices.mjs';
import { reorderErrors } from '../../lists/reorder-errors.mjs';
import 'klona/full';
import { reorderPath } from '../../paths/reorder-path.mjs';
import { insertPath } from '../../paths/insert-path.mjs';
import { removePath } from '../../paths/remove-path.mjs';
import { replacePath } from '../../paths/replace-path.mjs';

function useFormList({
  $values,
  $errors,
  $status
}) {
  const reorderListItem = useCallback((path, payload) => {
    $status.clearFieldDirty(path);
    $errors.setErrors((errs) => reorderErrors(path, payload, errs));
    $values.setValues({
      values: reorderPath(path, payload, $values.refValues.current),
      updateState: true
    });
  }, []);
  const removeListItem = useCallback((path, index) => {
    $status.clearFieldDirty(path);
    $errors.setErrors((errs) => changeErrorIndices(path, index, errs, -1));
    $values.setValues({
      values: removePath(path, index, $values.refValues.current),
      updateState: true
    });
  }, []);
  const insertListItem = useCallback((path, item, index) => {
    $status.clearFieldDirty(path);
    $errors.setErrors((errs) => changeErrorIndices(path, index, errs, 1));
    $values.setValues({
      values: insertPath(path, item, index, $values.refValues.current),
      updateState: true
    });
  }, []);
  const replaceListItem = useCallback((path, index, item) => {
    $status.clearFieldDirty(path);
    $values.setValues({
      values: replacePath(path, item, index, $values.refValues.current),
      updateState: true
    });
  }, []);
  return { reorderListItem, removeListItem, insertListItem, replaceListItem };
}

export { useFormList };
//# sourceMappingURL=use-form-list.mjs.map
