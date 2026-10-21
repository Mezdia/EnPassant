import { BoxProps, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
import type { DateLabelFormat, DayOfWeek } from '../../types';
export type WeekdaysRowStylesNames = 'weekday' | 'weekdaysRow';
export type WeekdaysRowCssVariables = {
    weekdaysRow: '--wr-fz' | '--wr-spacing';
};
export interface WeekdaysRowProps extends BoxProps, StylesApiProps<WeekdaysRowFactory>, ElementProps<'tr'> {
    __staticSelector?: string;
    /** Controls size */
    size?: MantineSize;
    /** dayjs locale */
    locale?: string;
    /** Number 0-6, 0 – Sunday, 6 – Saturday @default `1` – Monday */
    firstDayOfWeek?: DayOfWeek;
    /** dayjs format to get weekday name @default `'dd'` */
    weekdayFormat?: DateLabelFormat;
    /** Sets cell type that is used for weekdays @default `'th'` */
    cellComponent?: 'td' | 'th';
    /** If set, heading for week numbers is displayed */
    withWeekNumbers?: boolean;
}
export type WeekdaysRowFactory = Factory<{
    props: WeekdaysRowProps;
    ref: HTMLTableRowElement;
    stylesNames: WeekdaysRowStylesNames;
    vars: WeekdaysRowCssVariables;
}>;
export declare const WeekdaysRow: import("@mantine/core").MantineComponent<{
    props: WeekdaysRowProps;
    ref: HTMLTableRowElement;
    stylesNames: WeekdaysRowStylesNames;
    vars: WeekdaysRowCssVariables;
}>;
