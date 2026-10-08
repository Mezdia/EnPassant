import { BoxProps, DataAttributes, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
export type MiniCalendarStylesNames = 'root' | 'control' | 'days' | 'day' | 'dayMonth' | 'dayNumber';
export type MiniCalendarCssVariables = {
    root: '--mini-calendar-font-size';
};
export interface MiniCalendarProps extends BoxProps, StylesApiProps<MiniCalendarFactory>, ElementProps<'div', 'onChange'> {
    /** Controlled component date value, start date of the interval */
    date?: Date | string;
    /** Uncontrolled component default value, start date of the interval */
    defaultDate?: Date | string;
    /** Called with date in `YYYY-MM-DD` format when date internal changes */
    onDateChange?: (date: string) => void;
    /** Selected date, controlled value */
    value?: Date | string | null;
    /** Called with date in `YYYY-MM-DD` format when date changes */
    onChange?: (date: string) => void;
    /** Maximum date that can be selected, date object or date string in `YYYY-MM-DD` format */
    maxDate?: Date | string;
    /** Minimum date that can be selected, date object or date string in `YYYY-MM-DD` format */
    minDate?: Date | string;
    /** Number of days to display in the calendar @default 7 */
    numberOfDays?: number;
    /** Dayjs format string for month label @default `MMM` */
    monthLabelFormat?: string;
    /** Called when the next button is clicked */
    onNext?: () => void;
    /** Called when the previous button is clicked */
    onPrevious?: () => void;
    /** Props passed down to the day component */
    getDayProps?: (date: string) => Record<string, any>;
    /** Component size @default 'sm' */
    size?: MantineSize;
    /** Props passed to previous control button */
    previousControlProps?: React.ComponentPropsWithoutRef<'button'> & DataAttributes;
    /** Props passed to next control button */
    nextControlProps?: React.ComponentPropsWithoutRef<'button'> & DataAttributes;
    /** dayjs locale used for formatting */
    locale?: string;
}
export type MiniCalendarFactory = Factory<{
    props: MiniCalendarProps;
    ref: HTMLDivElement;
    stylesNames: MiniCalendarStylesNames;
    vars: MiniCalendarCssVariables;
}>;
export declare const MiniCalendar: import("@mantine/core").MantineComponent<{
    props: MiniCalendarProps;
    ref: HTMLDivElement;
    stylesNames: MiniCalendarStylesNames;
    vars: MiniCalendarCssVariables;
}>;
