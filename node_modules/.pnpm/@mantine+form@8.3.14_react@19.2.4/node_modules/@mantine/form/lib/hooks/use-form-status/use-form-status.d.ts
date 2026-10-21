import { ClearFieldDirty, FormMode, FormStatus, GetFieldStatus, ResetStatus, SetCalculatedFieldDirty, SetFieldDirty, SetFieldTouched } from '../../types';
import type { $FormValues } from '../use-form-values/use-form-values';
export interface $FormStatus<Values extends Record<string, any>> {
    touchedState: FormStatus;
    dirtyState: FormStatus;
    touchedRef: React.RefObject<FormStatus>;
    dirtyRef: React.RefObject<FormStatus>;
    setTouched: React.Dispatch<React.SetStateAction<FormStatus>>;
    setDirty: React.Dispatch<React.SetStateAction<FormStatus>>;
    resetDirty: ResetStatus;
    resetTouched: ResetStatus;
    isTouched: GetFieldStatus<Values>;
    setFieldTouched: SetFieldTouched<Values>;
    setFieldDirty: SetFieldDirty<Values>;
    setTouchedState: React.Dispatch<React.SetStateAction<FormStatus>>;
    setDirtyState: React.Dispatch<React.SetStateAction<FormStatus>>;
    clearFieldDirty: ClearFieldDirty;
    isDirty: GetFieldStatus<Values>;
    getDirty: () => FormStatus;
    getTouched: () => FormStatus;
    setCalculatedFieldDirty: SetCalculatedFieldDirty<Values>;
}
interface UseFormStatusInput<Values extends Record<string, any>> {
    initialDirty: FormStatus;
    initialTouched: FormStatus;
    mode: FormMode;
    $values: $FormValues<Values>;
}
export declare function useFormStatus<Values extends Record<string, any>>({ initialDirty, initialTouched, mode, $values, }: UseFormStatusInput<Values>): $FormStatus<Values>;
export {};
