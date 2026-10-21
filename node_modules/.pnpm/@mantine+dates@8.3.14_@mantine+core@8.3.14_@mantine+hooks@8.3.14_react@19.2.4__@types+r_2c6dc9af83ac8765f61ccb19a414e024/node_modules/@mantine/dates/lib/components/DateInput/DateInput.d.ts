import { __BaseInputProps, __InputStylesNames, BoxProps, ElementProps, Factory, InputVariant, PopoverProps, StylesApiProps } from '@mantine/core';
import { CalendarLevel, DateStringValue, DateValue } from '../../types';
import { CalendarBaseProps, CalendarStylesNames } from '../Calendar';
import { DecadeLevelSettings } from '../DecadeLevel';
import { MonthLevelSettings } from '../MonthLevel';
import { YearLevelSettings } from '../YearLevel';
export type DateInputStylesNames = __InputStylesNames | CalendarStylesNames;
export interface DateInputProps extends BoxProps, Omit<__BaseInputProps, 'size'>, CalendarBaseProps, DecadeLevelSettings, YearLevelSettings, MonthLevelSettings, StylesApiProps<DateInputFactory>, ElementProps<'input', 'size' | 'value' | 'defaultValue' | 'onChange'> {
    /** A function to parse user input and convert it to date string value */
    dateParser?: (value: string) => DateStringValue | Date | null;
    /** Controlled component value */
    value?: DateValue | Date;
    /** Uncontrolled component default value */
    defaultValue?: DateValue | Date;
    /** Called when value changes */
    onChange?: (value: DateStringValue | null) => void;
    /** Props passed down to the `Popover` component */
    popoverProps?: Partial<Omit<PopoverProps, 'children'>>;
    /** If set, clear button is displayed in the `rightSection` when the component has value. Ignored if `rightSection` prop is set. @default `false` */
    clearable?: boolean;
    /** Props passed down to the clear button */
    clearButtonProps?: React.ComponentPropsWithoutRef<'button'>;
    /** `dayjs` format to display input value, `"MMMM D, YYYY"` by default  */
    valueFormat?: string;
    /** If set to `false`, invalid user input is preserved and is not corrected on blur */
    fixOnBlur?: boolean;
    /** If set, the value can be deselected by deleting everything from the input or by clicking the selected date in the dropdown. By default, `true` if `clearable` prop is set, `false` otherwise. */
    allowDeselect?: boolean;
    /** Max level that user can go up to @default `'decade'` */
    maxLevel?: CalendarLevel;
    /** Initial displayed level (uncontrolled) */
    defaultLevel?: CalendarLevel;
    /** Current displayed level (controlled) */
    level?: CalendarLevel;
    /** Called when the level changes */
    onLevelChange?: (level: CalendarLevel) => void;
}
export type DateInputFactory = Factory<{
    props: DateInputProps;
    ref: HTMLInputElement;
    stylesNames: DateInputStylesNames;
    variant: InputVariant;
}>;
export declare const DateInput: import("@mantine/core").MantineComponent<{
    props: DateInputProps;
    ref: HTMLInputElement;
    stylesNames: DateInputStylesNames;
    variant: InputVariant;
}>;
