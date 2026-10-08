import { FormMode } from '../../types';
export interface $FormValues<Values extends Record<PropertyKey, any>> {
    initialized: React.RefObject<boolean>;
    stateValues: Values;
    refValues: React.RefObject<Values>;
    valuesSnapshot: React.RefObject<Values>;
    setValues: (payload: SetValuesInput<Values>) => void;
    setFieldValue: (payload: SetFieldValueInput<Values>) => void;
    resetValues: () => void;
    setValuesSnapshot: (payload: Values) => void;
    initialize: (values: Values, onInitialize: () => void) => void;
    getValues: () => Values;
    getValuesSnapshot: () => Values;
    resetField: (path: PropertyKey, subscribers?: (SetFieldValueSubscriber<Values> | null | undefined)[]) => void;
}
export interface SetValuesSubscriberPayload<Values> {
    path?: PropertyKey;
    updatedValues: Values;
    previousValues: Values;
}
export interface SetValuesInput<Values> {
    values: Partial<Values> | ((values: Values) => Partial<Values>);
    mergeWithPreviousValues?: boolean;
    updateState?: boolean;
    subscribers?: (SetFieldValueSubscriber<Values> | null | undefined)[];
}
export type SetFieldValueSubscriber<Values> = (payload: SetValuesSubscriberPayload<Values>) => void;
export interface SetFieldValueInput<Values> {
    path: PropertyKey;
    value: any;
    updateState?: boolean;
    subscribers?: (SetFieldValueSubscriber<Values> | null | undefined)[];
}
interface UseFormValuesInput<Values extends Record<PropertyKey, any>> {
    initialValues: Values | undefined;
    mode: FormMode;
    onValuesChange?: ((values: Values, previousValues: Values) => void) | undefined;
}
export declare function useFormValues<Values extends Record<PropertyKey, any>>({ initialValues, onValuesChange, mode, }: UseFormValuesInput<Values>): $FormValues<Values>;
export {};
