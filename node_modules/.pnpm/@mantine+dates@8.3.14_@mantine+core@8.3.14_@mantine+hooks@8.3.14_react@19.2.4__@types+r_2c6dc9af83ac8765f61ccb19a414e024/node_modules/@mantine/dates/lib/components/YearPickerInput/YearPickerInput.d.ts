import { __InputStylesNames, BoxProps, Factory, InputVariant, MantineComponentStaticProperties, StylesApiProps } from '@mantine/core';
import { DatePickerType } from '../../types';
import { DateInputSharedProps } from '../PickerInputBase';
import { YearPickerBaseProps, YearPickerStylesNames } from '../YearPicker';
export type YearPickerInputStylesNames = __InputStylesNames | 'placeholder' | YearPickerStylesNames;
export interface YearPickerInputProps<Type extends DatePickerType = 'default'> extends BoxProps, DateInputSharedProps, YearPickerBaseProps<Type>, StylesApiProps<YearPickerInputFactory> {
    /** `dayjs` format to display input value @default `"YYYY"` */
    valueFormat?: string;
}
export type YearPickerInputFactory = Factory<{
    props: YearPickerInputProps;
    ref: HTMLButtonElement;
    stylesNames: YearPickerInputStylesNames;
    variant: InputVariant;
}>;
type YearPickerInputComponent = (<Type extends DatePickerType = 'default'>(props: YearPickerInputProps<Type> & {
    ref?: React.ForwardedRef<HTMLButtonElement>;
}) => React.JSX.Element) & {
    displayName?: string;
} & MantineComponentStaticProperties<YearPickerInputFactory>;
export declare const YearPickerInput: YearPickerInputComponent;
export {};
