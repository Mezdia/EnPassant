import { BoxProps, ElementProps, Factory, MantineComponentStaticProperties, StylesApiProps } from '@mantine/core';
import { DatePickerType, DateStringValue, PickerBaseProps } from '../../types';
import { CalendarBaseProps } from '../Calendar';
import { DecadeLevelBaseSettings } from '../DecadeLevel';
import { DecadeLevelGroupStylesNames } from '../DecadeLevelGroup';
export type YearPickerStylesNames = DecadeLevelGroupStylesNames;
export interface YearPickerBaseProps<Type extends DatePickerType = 'default'> extends PickerBaseProps<Type>, DecadeLevelBaseSettings, Omit<CalendarBaseProps, 'onNextYear' | 'onPreviousYear' | 'onNextMonth' | 'onPreviousMonth' | 'hasNextLevel'> {
}
export interface YearPickerProps<Type extends DatePickerType = 'default'> extends BoxProps, YearPickerBaseProps<Type>, StylesApiProps<YearPickerFactory>, ElementProps<'div', 'onChange' | 'value' | 'defaultValue'> {
    /** Called when year is selected */
    onYearSelect?: (date: DateStringValue) => void;
}
export type YearPickerFactory = Factory<{
    props: YearPickerProps;
    ref: HTMLDivElement;
    stylesNames: YearPickerStylesNames;
}>;
type YearPickerComponent = (<Type extends DatePickerType = 'default'>(props: YearPickerProps<Type> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
}) => React.JSX.Element) & {
    displayName?: string;
} & MantineComponentStaticProperties<YearPickerFactory>;
export declare const YearPicker: YearPickerComponent;
export {};
