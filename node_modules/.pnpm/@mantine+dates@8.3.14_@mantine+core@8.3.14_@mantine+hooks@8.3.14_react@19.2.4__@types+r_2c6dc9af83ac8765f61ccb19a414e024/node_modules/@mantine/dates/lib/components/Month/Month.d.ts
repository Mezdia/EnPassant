import { BoxProps, DataAttributes, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
import { ControlKeydownPayload, DateLabelFormat, DateStringValue, DayOfWeek } from '../../types';
import { DayProps, DayStylesNames, RenderDay } from '../Day';
export type MonthStylesNames = 'month' | 'weekday' | 'weekdaysRow' | 'monthRow' | 'month' | 'monthThead' | 'monthTbody' | 'monthCell' | 'weekNumber' | DayStylesNames;
export interface MonthSettings {
    /** Determines whether propagation for `Escape` key should be stopped */
    __stopPropagation?: boolean;
    /** Prevents focus shift when buttons are clicked */
    __preventFocus?: boolean;
    /** Called when day is clicked with click event and date */
    __onDayClick?: (event: React.MouseEvent<HTMLButtonElement>, date: DateStringValue) => void;
    /** Called when mouse enters day */
    __onDayMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>, date: DateStringValue) => void;
    /** Called when any keydown event is registered on day, used for arrows navigation */
    __onDayKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, payload: ControlKeydownPayload) => void;
    /** Assigns ref of every day based on its position in the table, used for arrows navigation */
    __getDayRef?: (rowIndex: number, cellIndex: number, node: HTMLButtonElement) => void;
    /** `dayjs` locale, the default value is defined by `DatesProvider` */
    locale?: string;
    /** Number 0-6, where 0 – Sunday and 6 – Saturday. @default `1` – Monday */
    firstDayOfWeek?: DayOfWeek;
    /** `dayjs` format for weekdays names @default `'dd'` */
    weekdayFormat?: DateLabelFormat;
    /** Indices of weekend days, 0-6, where 0 is Sunday and 6 is Saturday. The default value is defined by `DatesProvider`. */
    weekendDays?: DayOfWeek[];
    /** Passes props down to `Day` components */
    getDayProps?: (date: DateStringValue) => Omit<Partial<DayProps>, 'classNames' | 'styles' | 'vars'> & DataAttributes;
    /** Callback function to determine whether the day should be disabled */
    excludeDate?: (date: DateStringValue) => boolean;
    /** Minimum possible date, in `YYYY-MM-DD` format */
    minDate?: DateStringValue | Date;
    /** Maximum possible date, in `YYYY-MM-DD` format */
    maxDate?: DateStringValue | Date;
    /** Controls day value rendering */
    renderDay?: RenderDay;
    /** Determines whether outside dates should be hidden @default `false` */
    hideOutsideDates?: boolean;
    /** Determines whether weekdays row should be hidden @default `false` */
    hideWeekdays?: boolean;
    /** Assigns `aria-label` to `Day` components based on date */
    getDayAriaLabel?: (date: DateStringValue) => string;
    /** Controls size */
    size?: MantineSize;
    /** Determines whether controls should be separated by space @default `true` */
    withCellSpacing?: boolean;
    /** Determines whether today should be highlighted with a border @default `false` */
    highlightToday?: boolean;
    /** Determines whether week numbers should be displayed @default `false` */
    withWeekNumbers?: boolean;
}
export interface MonthProps extends BoxProps, MonthSettings, StylesApiProps<MonthFactory>, ElementProps<'div'> {
    __staticSelector?: string;
    /** Month to display, value `YYYY-MM-DD` */
    month: DateStringValue;
    /** Determines whether days should be static, static days can be used to display month if it is not expected that user will interact with the component in any way  */
    static?: boolean;
}
export type MonthFactory = Factory<{
    props: MonthProps;
    ref: HTMLTableElement;
    stylesNames: MonthStylesNames;
}>;
export declare const Month: import("@mantine/core").MantineComponent<{
    props: MonthProps;
    ref: HTMLTableElement;
    stylesNames: MonthStylesNames;
}>;
