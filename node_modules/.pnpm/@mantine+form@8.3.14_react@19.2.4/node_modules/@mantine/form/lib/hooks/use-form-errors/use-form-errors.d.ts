import { ClearErrors, ClearFieldError, FormErrors, SetErrors, SetFieldError } from '../../types';
export interface $FormErrors<Values extends Record<string, any>> {
    errorsState: FormErrors;
    setErrors: SetErrors;
    clearErrors: ClearErrors;
    setFieldError: SetFieldError<Values>;
    clearFieldError: ClearFieldError;
}
export declare function useFormErrors<Values extends Record<string, any>>(initialErrors: FormErrors): $FormErrors<Values>;
