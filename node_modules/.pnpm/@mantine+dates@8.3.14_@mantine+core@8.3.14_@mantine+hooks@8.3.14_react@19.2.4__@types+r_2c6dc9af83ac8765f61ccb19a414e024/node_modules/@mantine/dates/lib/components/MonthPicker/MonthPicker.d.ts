import { BoxProps, ElementProps, Factory, MantineComponentStaticProperties, StylesApiProps } from '@mantine/core';
import { CalendarLevel, DatePickerType, DateStringValue, PickerBaseProps } from '../../types';
import { CalendarBaseProps } from '../Calendar';
import { DecadeLevelBaseSettings } from '../DecadeLevel';
import { DecadeLevelGroupStylesNames } from '../DecadeLevelGroup';
import { YearLevelBaseSettings } from '../YearLevel';
import { YearLevelGroupStylesNames } from '../YearLevelGroup';
export type MonthPickerStylesNames = DecadeLevelGroupStylesNames | YearLevelGroupStylesNames;
type MonthPickerLevel = Exclude<CalendarLevel, 'month'>;
export interface MonthPickerBaseProps<Type extends DatePickerType = 'default'> extends PickerBaseProps<Type>, DecadeLevelBaseSettings, YearLevelBaseSettings, Omit<CalendarBaseProps, 'onNextMonth' | 'onPreviousMonth' | 'hasNextLevel'> {
    /** Max level that user can go up to @default `'decade'` */
    maxLevel?: CalendarLevel;
    /** Initial displayed level (uncontrolled) */
    defaultLevel?: CalendarLevel;
    /** Current displayed level (controlled) */
    level?: CalendarLevel;
    /** Called when level changes */
    onLevelChange?: (level: MonthPickerLevel) => void;
}
export interface MonthPickerProps<Type extends DatePickerType = 'default'> extends BoxProps, MonthPickerBaseProps<Type>, StylesApiProps<MonthPickerFactory>, ElementProps<'div', 'onChange' | 'value' | 'defaultValue'> {
    /** Called when month is selected */
    onMonthSelect?: (date: DateStringValue) => void;
}
export type MonthPickerFactory = Factory<{
    props: MonthPickerProps;
    ref: HTMLDivElement;
    stylesNames: MonthPickerStylesNames;
}>;
type MonthPickerComponent = (<Type extends DatePickerType = 'default'>(props: MonthPickerProps<Type> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
}) => React.JSX.Element) & {
    displayName?: string;
} & MantineComponentStaticProperties<MonthPickerFactory>;
export declare const MonthPicker: MonthPickerComponent;
export {};
