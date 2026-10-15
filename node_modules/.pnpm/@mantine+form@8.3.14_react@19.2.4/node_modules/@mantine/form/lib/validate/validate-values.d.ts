import { FormErrors, FormValidateInput } from '../types';
export declare const formRootRule: unique symbol;
export declare function validateValues<T>(validate: FormValidateInput<T> | undefined, values: T): {
    hasErrors: boolean;
    errors: FormErrors;
};
