import { TransformedValues, UseFormReturnType } from '../types';
export interface FormProps<Form extends UseFormReturnType<any>> extends React.ComponentPropsWithRef<'form'> {
    form: Form;
    onSubmit?: (values: TransformedValues<Form>) => void;
}
export type FormComponent = (<Form extends UseFormReturnType<any>>(props: FormProps<Form>) => React.JSX.Element | React.ReactNode) & {
    displayName?: string;
};
export declare const Form: FormComponent;
