import { BoxProps, DataAttributes, ElementProps, Factory, MantineRadius, MantineSize, SimpleGridProps, StylesApiProps } from '@mantine/core';
import type { TimePickerAmPmLabels, TimePickerFormat } from '../TimePicker';
export type TimeGridStylesNames = 'root' | 'control' | 'simpleGrid';
export type TimeGridCssVariables = {
    root: '--time-grid-fz' | '--time-grid-radius';
};
export interface TimeGridProps extends BoxProps, StylesApiProps<TimeGridFactory>, ElementProps<'div', 'onChange' | 'value' | 'defaultValue'> {
    /** Time data in 24h format to be displayed in the grid, for example `['10:00', '18:30', '22:00']`. Time values must be unique. */
    data: string[];
    /** Controlled component value */
    value?: string | null;
    /** Uncontrolled component default value */
    defaultValue?: string | null;
    /** Called when value changes */
    onChange?: (value: string | null) => void;
    /** Determines whether the value can be deselected when the current active option is clicked or activated with keyboard @default `false` */
    allowDeselect?: boolean;
    /** Time format displayed in the grid @default `'24h'` */
    format?: TimePickerFormat;
    /** Determines whether the seconds part should be displayed @default `false` */
    withSeconds?: boolean;
    /** Labels used for am/pm values @default `{ am: 'AM', pm: 'PM' }` */
    amPmLabels?: TimePickerAmPmLabels;
    /** Props passed down to the underlying `SimpleGrid` component @default `{ cols: 3, spacing: 'xs' }` */
    simpleGridProps?: SimpleGridProps;
    /** A function to pass props down to control based on the time value */
    getControlProps?: (time: string) => React.ComponentPropsWithoutRef<'button'> & DataAttributes;
    /** Key of `theme.radius` or any valid CSS value to set `border-radius` @default `theme.defaultRadius` */
    radius?: MantineRadius;
    /** Control `font-size` of controls, key of `theme.fontSizes` or any valid CSS value @default `'sm'` */
    size?: MantineSize;
    /** All controls before this time are disabled */
    minTime?: string;
    /** All controls after this time are disabled */
    maxTime?: string;
    /** Array of time values to disable */
    disableTime?: string[] | ((time: string) => boolean);
    /** If set, all controls are disabled */
    disabled?: boolean;
}
export type TimeGridFactory = Factory<{
    props: TimeGridProps;
    ref: HTMLDivElement;
    stylesNames: TimeGridStylesNames;
    vars: TimeGridCssVariables;
}>;
export declare const TimeGrid: import("@mantine/core").MantineComponent<{
    props: TimeGridProps;
    ref: HTMLDivElement;
    stylesNames: TimeGridStylesNames;
    vars: TimeGridCssVariables;
}>;
