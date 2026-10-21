import { FormFieldValidationResult, FormValidateInput } from '../types';
export declare function validateFieldValue<T>(path: unknown, rules: FormValidateInput<T> | undefined, values: T): FormFieldValidationResult;
