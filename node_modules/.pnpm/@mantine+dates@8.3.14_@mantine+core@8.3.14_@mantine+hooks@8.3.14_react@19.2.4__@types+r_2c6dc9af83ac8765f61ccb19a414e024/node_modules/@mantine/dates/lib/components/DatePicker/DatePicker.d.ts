import { BoxProps, ElementProps, Factory, MantineComponentStaticProperties, StylesApiProps } from '@mantine/core';
import { CalendarLevel, DatePickerType, DateStringValue, PickerBaseProps } from '../../types';
import { CalendarBaseProps, CalendarProps, CalendarSettings, CalendarStylesNames } from '../Calendar';
import { DecadeLevelBaseSettings } from '../DecadeLevel';
import { MonthLevelBaseSettings } from '../MonthLevel';
import { YearLevelBaseSettings } from '../YearLevel';
export interface DatePickerPreset<Type extends DatePickerType> {
    value: Type extends 'range' ? [DateStringValue | null, DateStringValue | null] : Type extends 'multiple' ? DateStringValue[] : DateStringValue | null;
    label: React.ReactNode;
}
export type DatePickerCssVariables = {
    datePickerRoot: '--preset-font-size';
};
export type DatePickerStylesNames = CalendarStylesNames | 'presetsList' | 'presetButton' | 'datePickerRoot';
export interface DatePickerBaseProps<Type extends DatePickerType = 'default'> extends PickerBaseProps<Type>, DecadeLevelBaseSettings, YearLevelBaseSettings, MonthLevelBaseSettings, CalendarBaseProps, Omit<CalendarSettings, 'hasNextLevel'>, Pick<CalendarProps, 'enableKeyboardNavigation'> {
    maxLevel?: CalendarLevel;
    /** Initial displayed level (uncontrolled) */
    defaultLevel?: CalendarLevel;
    /** Current displayed level (controlled) */
    level?: CalendarLevel;
    /** Called when level changes */
    onLevelChange?: (level: CalendarLevel) => void;
    /** Predefined values to pick from */
    presets?: DatePickerPreset<Type>[];
    /** If defined, called with preset value, suppresses `onChange` call */
    __onPresetSelect?: (preset: Type extends 'range' ? [DateStringValue | null, DateStringValue | null] : DateStringValue | null) => void;
}
export interface DatePickerProps<Type extends DatePickerType = 'default'> extends BoxProps, DatePickerBaseProps<Type>, StylesApiProps<DatePickerFactory>, ElementProps<'div', 'onChange' | 'value' | 'defaultValue'> {
}
export type DatePickerFactory = Factory<{
    props: DatePickerProps;
    ref: HTMLDivElement;
    stylesNames: DatePickerStylesNames;
}>;
type DatePickerComponent = (<Type extends DatePickerType = 'default'>(props: DatePickerProps<Type> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
}) => React.JSX.Element) & {
    displayName?: string;
} & MantineComponentStaticProperties<DatePickerFactory>;
export declare const DatePicker: DatePickerComponent;
export {};
