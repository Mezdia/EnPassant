import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { DateLabelFormat, DateStringValue } from '../../types';
import { CalendarHeaderSettings, CalendarHeaderStylesNames } from '../CalendarHeader';
import { MonthSettings, MonthStylesNames } from '../Month';
export type MonthLevelStylesNames = MonthStylesNames | CalendarHeaderStylesNames;
export interface MonthLevelBaseSettings extends MonthSettings {
    /** dayjs label format to display month label or a function that returns month label based on month value @default `"MMMM YYYY"` */
    monthLabelFormat?: DateLabelFormat;
}
export interface MonthLevelSettings extends MonthLevelBaseSettings, CalendarHeaderSettings {
}
export interface MonthLevelProps extends BoxProps, MonthLevelSettings, Omit<StylesApiProps<MonthLevelFactory>, 'classNames' | 'styles'>, ElementProps<'div'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    /** Month that is currently displayed */
    month: DateStringValue;
    /** Aria-label for change level control */
    levelControlAriaLabel?: string;
    /** Determines whether days should be static, static days can be used to display month if it is not expected that user will interact with the component in any way  */
    static?: boolean;
}
export type MonthLevelFactory = Factory<{
    props: MonthLevelProps;
    ref: HTMLDivElement;
    stylesNames: MonthLevelStylesNames;
}>;
export declare const MonthLevel: import("@mantine/core").MantineComponent<{
    props: MonthLevelProps;
    ref: HTMLDivElement;
    stylesNames: MonthLevelStylesNames;
}>;
