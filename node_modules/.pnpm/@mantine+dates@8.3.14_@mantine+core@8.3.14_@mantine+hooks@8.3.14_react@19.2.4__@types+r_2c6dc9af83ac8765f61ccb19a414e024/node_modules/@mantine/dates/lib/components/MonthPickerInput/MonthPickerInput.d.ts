import { __InputStylesNames, BoxProps, Factory, InputVariant, MantineComponentStaticProperties, StylesApiProps } from '@mantine/core';
import { DatePickerType } from '../../types';
import { MonthPickerBaseProps, MonthPickerStylesNames } from '../MonthPicker';
import { DateInputSharedProps } from '../PickerInputBase';
export type MonthPickerInputStylesNames = __InputStylesNames | 'placeholder' | MonthPickerStylesNames;
export interface MonthPickerInputProps<Type extends DatePickerType = 'default'> extends BoxProps, DateInputSharedProps, MonthPickerBaseProps<Type>, StylesApiProps<MonthPickerInputFactory> {
    /** `dayjs` format for input value @default `"MMMM YYYY"` */
    valueFormat?: string;
}
export type MonthPickerInputFactory = Factory<{
    props: MonthPickerInputProps;
    ref: HTMLButtonElement;
    stylesNames: MonthPickerInputStylesNames;
    variant: InputVariant;
}>;
type MonthPickerInputComponent = (<Type extends DatePickerType = 'default'>(props: MonthPickerInputProps<Type> & {
    ref?: React.ForwardedRef<HTMLButtonElement>;
}) => React.JSX.Element) & {
    displayName?: string;
} & MantineComponentStaticProperties<MonthPickerInputFactory>;
export declare const MonthPickerInput: MonthPickerInputComponent;
export {};
