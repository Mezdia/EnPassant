import { __BaseInputProps, __InputStylesNames, BoxProps, CloseButtonProps, DataAttributes, ElementProps, Factory, InputVariant, PopoverProps, ScrollAreaProps, StylesApiProps } from '@mantine/core';
import { TimePickerAmPmLabels, TimePickerFormat, TimePickerPasteSplit, TimePickerPresets } from './TimePicker.types';
export type TimePickerStylesNames = 'fieldsRoot' | 'fieldsGroup' | 'field' | 'controlsList' | 'controlsListGroup' | 'control' | 'dropdown' | 'presetsRoot' | 'presetsGroup' | 'presetsGroupLabel' | 'presetControl' | 'scrollarea' | __InputStylesNames;
export type TimePickerCssVariables = {
    dropdown: '--control-font-size';
};
export interface TimePickerProps extends BoxProps, __BaseInputProps, StylesApiProps<TimePickerFactory>, ElementProps<'div', 'onChange' | 'defaultValue'> {
    /** Controlled component value */
    value?: string;
    /** Uncontrolled component default value */
    defaultValue?: string;
    /** Called when the value changes */
    onChange?: (value: string) => void;
    /** Determines whether the clear button should be displayed @default `false` */
    clearable?: boolean;
    /** `name` prop passed down to the hidden input */
    name?: string;
    /** `form` prop passed down to the hidden input */
    form?: string;
    /** Min possible time value in `hh:mm:ss` format */
    min?: string;
    /** Max possible time value in `hh:mm:ss` format */
    max?: string;
    /** Time format, `'24h'` by default */
    format?: TimePickerFormat;
    /** Number by which hours are incremented/decremented @default `1` */
    hoursStep?: number;
    /** Number by which minutes are incremented/decremented @default `1` */
    minutesStep?: number;
    /** Number by which seconds are incremented/decremented @default `1` */
    secondsStep?: number;
    /** Determines whether the seconds input should be displayed @default `false` */
    withSeconds?: boolean;
    /** `aria-label` of hours input */
    hoursInputLabel?: string;
    /** `aria-label` of minutes input */
    minutesInputLabel?: string;
    /** `aria-label` of seconds input */
    secondsInputLabel?: string;
    /** `aria-label` of am/pm input */
    amPmInputLabel?: string;
    /** Labels used for am/pm values @default `{ am: 'AM', pm: 'PM' }` */
    amPmLabels?: TimePickerAmPmLabels;
    /** Determines whether the dropdown with time controls list should be visible when the input has focus @default `false` */
    withDropdown?: boolean;
    /** Props passed down to `Popover` component */
    popoverProps?: PopoverProps;
    /** Called once when one of the inputs is focused, not called when focused is shifted between hours, minutes, seconds and am/pm inputs */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Called once when the focus is no longer on any of the inputs */
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
    /** Props passed down to clear button */
    clearButtonProps?: CloseButtonProps & ElementProps<'button'> & DataAttributes;
    /** Props passed down to hours input */
    hoursInputProps?: React.ComponentPropsWithoutRef<'input'> & DataAttributes;
    /** Props passed down to minutes input */
    minutesInputProps?: React.ComponentPropsWithoutRef<'input'> & DataAttributes;
    /** Props passed down to seconds input */
    secondsInputProps?: React.ComponentPropsWithoutRef<'input'> & DataAttributes;
    /** Props passed down to am/pm select */
    amPmSelectProps?: React.ComponentPropsWithoutRef<'select'> & DataAttributes;
    /** If set, the value cannot be updated */
    readOnly?: boolean;
    /** If set, the component becomes disabled */
    disabled?: boolean;
    /** Props passed down to the hidden input */
    hiddenInputProps?: React.ComponentPropsWithoutRef<'input'> & DataAttributes;
    /** A function to transform paste values, by default time in 24h format can be parsed on paste for example `23:34:22` */
    pasteSplit?: TimePickerPasteSplit;
    /** A ref object to get node reference of the hours input */
    hoursRef?: React.Ref<HTMLInputElement>;
    /** A ref object to get node reference of the minutes input */
    minutesRef?: React.Ref<HTMLInputElement>;
    /** A ref object to get node reference of the seconds input */
    secondsRef?: React.Ref<HTMLInputElement>;
    /** A ref object to get node reference of the am/pm select */
    amPmRef?: React.Ref<HTMLSelectElement>;
    /** Time presets to display in the dropdown */
    presets?: TimePickerPresets;
    /** Maximum height of the content displayed in the dropdown in px @default `200` */
    maxDropdownContentHeight?: number;
    /** Props passed down to all underlying `ScrollArea` components */
    scrollAreaProps?: ScrollAreaProps;
    /** If set, the time controls list are reversed, @default `false` */
    reverseTimeControlsList?: boolean;
    /** Hours input placeholder, @default `--` */
    hoursPlaceholder?: string;
    /** Minutes input placeholder, @default `--` */
    minutesPlaceholder?: string;
    /** Seconds input placeholder, @default `--` */
    secondsPlaceholder?: string;
}
export type TimePickerFactory = Factory<{
    props: TimePickerProps;
    ref: HTMLDivElement;
    stylesNames: TimePickerStylesNames;
    vars: TimePickerCssVariables;
    variant: InputVariant;
}>;
export declare const TimePicker: import("@mantine/core").MantineComponent<{
    props: TimePickerProps;
    ref: HTMLDivElement;
    stylesNames: TimePickerStylesNames;
    vars: TimePickerCssVariables;
    variant: InputVariant;
}>;
