import type { FormErrors } from '../../types';
interface ZodError {
    path: (string | number)[];
    message: string;
}
interface ZodParseSuccess {
    success: true;
}
interface ZodParseError {
    success: false;
    error: {
        errors: ZodError[];
    };
}
interface ZodSchema<T extends Record<string, any>> {
    safeParse: (values: T) => ZodParseSuccess | ZodParseError;
}
/** @deprecated Use https://github.com/mantinedev/mantine-form-zod-resolver */
export declare function zodResolver<T extends Record<string, any>>(schema: ZodSchema<T>): (values: T) => FormErrors;
export {};
