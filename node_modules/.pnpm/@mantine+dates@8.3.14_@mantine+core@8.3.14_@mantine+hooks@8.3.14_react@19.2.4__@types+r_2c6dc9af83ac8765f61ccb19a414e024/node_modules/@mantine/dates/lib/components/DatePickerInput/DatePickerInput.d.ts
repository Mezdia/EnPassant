import { __InputStylesNames, BoxProps, Factory, InputVariant, MantineComponentStaticProperties, StylesApiProps } from '@mantine/core';
import { DatePickerType } from '../../types';
import { DatePickerBaseProps, DatePickerStylesNames } from '../DatePicker';
import { DateInputSharedProps } from '../PickerInputBase';
export type DatePickerInputStylesNames = __InputStylesNames | 'placeholder' | DatePickerStylesNames;
export interface DatePickerInputProps<Type extends DatePickerType = 'default'> extends BoxProps, DateInputSharedProps, DatePickerBaseProps<Type>, StylesApiProps<DatePickerInputFactory> {
    /** `dayjs` format for input value @default `"MMMM D, YYYY"` */
    valueFormat?: string;
}
export type DatePickerInputFactory = Factory<{
    props: DatePickerInputProps;
    ref: HTMLButtonElement;
    stylesNames: DatePickerInputStylesNames;
    variant: InputVariant;
}>;
type DatePickerInputComponent = (<Type extends DatePickerType = 'default'>(props: DatePickerInputProps<Type> & {
    ref?: React.ForwardedRef<HTMLButtonElement>;
}) => React.JSX.Element) & {
    displayName?: string;
} & MantineComponentStaticProperties<DatePickerInputFactory>;
export declare const DatePickerInput: DatePickerInputComponent;
export {};
