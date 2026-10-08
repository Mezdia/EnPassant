import { BoxProps, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
import { DateStringValue } from '../../types';
export type RenderDay = (date: DateStringValue) => React.ReactNode;
export type DayStylesNames = 'day';
export type DayCssVariables = {
    day: '--day-size';
};
export interface DayProps extends BoxProps, StylesApiProps<DayFactory>, ElementProps<'button'> {
    __staticSelector?: string;
    /** Determines which element is used as root, `'button'` by default, `'div'` if static prop is set */
    static?: boolean;
    /** Date that is displayed in `YYYY-MM-DD` format */
    date: DateStringValue;
    /** Control width and height of the day @default `'sm'` */
    size?: MantineSize;
    /** Determines whether the day is considered to be a weekend @default `false` */
    weekend?: boolean;
    /** Determines whether the day is outside of the current month @default `false` */
    outside?: boolean;
    /** Determines whether the day is selected @default `false` */
    selected?: boolean;
    /** Determines whether the day should not be displayed @default `false` */
    hidden?: boolean;
    /** Determines whether the day is selected in range @default `false` */
    inRange?: boolean;
    /** Determines whether the day is first in range selection @default `false` */
    firstInRange?: boolean;
    /** Determines whether the day is last in range selection @default `false` */
    lastInRange?: boolean;
    /** Controls day value rendering */
    renderDay?: RenderDay;
    /** Determines whether today should be highlighted with a border @default `false` */
    highlightToday?: boolean;
}
export type DayFactory = Factory<{
    props: DayProps;
    ref: HTMLButtonElement;
    stylesNames: DayStylesNames;
    vars: DayCssVariables;
}>;
export declare const Day: import("@mantine/core").MantineComponent<{
    props: DayProps;
    ref: HTMLButtonElement;
    stylesNames: DayStylesNames;
    vars: DayCssVariables;
}>;
