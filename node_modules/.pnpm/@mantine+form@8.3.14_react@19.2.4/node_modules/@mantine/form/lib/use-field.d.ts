import { FormMode, GetInputPropsType } from './types';
type UseFieldErrorResolver = (error: unknown) => React.ReactNode;
export interface UseFieldInput<T, FieldType extends GetInputPropsType = 'input', Mode extends FormMode = 'controlled'> {
    /** Field mode, controlled by default */
    mode?: Mode;
    /** Initial field value */
    initialValue: T;
    /** Initial touched value */
    initialTouched?: boolean;
    /** Initial field error message */
    initialError?: React.ReactNode;
    /** Called with updated value when the field value changes */
    onValueChange?: (value: T) => void;
    /** Determines whether the field should be validated when value changes, false by default */
    validateOnChange?: boolean;
    /** Determines whether the field should be validated when it loses focus, false by default */
    validateOnBlur?: boolean;
    /** Determines whether the field should clear error message when value changes, true by default */
    clearErrorOnChange?: boolean;
    /** A function to validate field value, can be sync or async */
    validate?: (value: T) => React.ReactNode | Promise<React.ReactNode>;
    /** Field type, input by default */
    type?: FieldType;
    /** A function to resolve validation error from the result returned from validate function, should return react node */
    resolveValidationError?: UseFieldErrorResolver;
}
interface GetInputPropsOptions {
    withError?: boolean;
    withFocus?: boolean;
}
interface GetInputPropsSharedReturn {
    error?: React.ReactNode;
    onFocus?: () => void;
    onBlur: () => void;
    onChange: (value: any) => void;
}
type GetInputPropsTypeValue<T, FieldType extends GetInputPropsType, Mode extends FormMode> = FieldType extends 'checkbox' ? Mode extends 'controlled' ? {
    checked: boolean;
} : {
    defaultChecked: boolean;
} : Mode extends 'controlled' ? {
    value: T;
} : {
    defaultValue: T;
};
type GetInputPropsReturnType<T, FieldType extends GetInputPropsType, Mode extends FormMode> = GetInputPropsSharedReturn & GetInputPropsTypeValue<T, FieldType, Mode>;
export interface UseFieldReturnType<T, FieldType extends GetInputPropsType = 'input', Mode extends FormMode = 'controlled'> {
    /** Returns props to pass to the input element */
    getInputProps: (options?: GetInputPropsOptions) => GetInputPropsReturnType<T, FieldType, Mode>;
    /** Returns current input value */
    getValue: () => T;
    /** Sets input value to the given value */
    setValue: (value: T) => void;
    /** Resets field value to initial state, sets touched state to false, sets error to null */
    reset: () => void;
    /** Validates current input value when called */
    validate: () => Promise<React.ReactNode | void>;
    /** Set to true when async validate function is called, stays true until the returned promise resolves */
    isValidating: boolean;
    /** Current error message */
    error: React.ReactNode;
    /** Sets error message to the given react node */
    setError: (error: React.ReactNode) => void;
    /** Returns true if the input has been focused at least once */
    isTouched: () => boolean;
    /** Returns true if input value is different from the initial value */
    isDirty: () => boolean;
    /** Resets touched state to false */
    resetTouched: () => void;
    /** Key that should be added to the input when mode is uncontrolled */
    key: number;
}
export declare function useField<T, Mode extends FormMode = 'controlled', FieldType extends GetInputPropsType = 'input'>({ mode, clearErrorOnChange, initialValue, initialError, initialTouched, onValueChange, validateOnChange, validateOnBlur, validate, resolveValidationError, type, }: UseFieldInput<T, FieldType, Mode>): UseFieldReturnType<T, FieldType, Mode>;
export {};
