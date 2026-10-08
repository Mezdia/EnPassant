import { InsertListItem, RemoveListItem, ReorderListItem, ReplaceListItem } from '../../types';
import type { $FormErrors } from '../use-form-errors/use-form-errors';
import type { $FormStatus } from '../use-form-status/use-form-status';
import type { $FormValues } from '../use-form-values/use-form-values';
interface UseFormListInput<Values extends Record<string, any>> {
    $values: $FormValues<Values>;
    $errors: $FormErrors<Values>;
    $status: $FormStatus<Values>;
}
export declare function useFormList<Values extends Record<string, any>>({ $values, $errors, $status, }: UseFormListInput<Values>): {
    reorderListItem: ReorderListItem<Values>;
    removeListItem: RemoveListItem<Values>;
    insertListItem: InsertListItem<Values>;
    replaceListItem: ReplaceListItem<Values>;
};
export {};
