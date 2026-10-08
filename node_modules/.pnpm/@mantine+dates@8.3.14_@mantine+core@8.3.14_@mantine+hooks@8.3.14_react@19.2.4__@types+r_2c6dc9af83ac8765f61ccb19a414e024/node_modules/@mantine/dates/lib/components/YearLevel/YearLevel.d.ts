import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { DateLabelFormat, DateStringValue } from '../../types';
import { CalendarHeaderSettings, CalendarHeaderStylesNames } from '../CalendarHeader';
import { MonthsListSettings, MonthsListStylesNames } from '../MonthsList';
export type YearLevelStylesNames = MonthsListStylesNames | CalendarHeaderStylesNames;
export interface YearLevelBaseSettings extends MonthsListSettings {
    /** dayjs label format to display year label or a function that returns year label based on year value @default `"YYYY"` */
    yearLabelFormat?: DateLabelFormat;
}
export interface YearLevelSettings extends YearLevelBaseSettings, CalendarHeaderSettings {
}
export interface YearLevelProps extends BoxProps, YearLevelSettings, Omit<StylesApiProps<YearLevelFactory>, 'classNames' | 'styles'>, ElementProps<'div'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    /** Displayed year value in `YYYY-MM-DD` format */
    year: DateStringValue;
    /** `aria-label` for change level control */
    levelControlAriaLabel?: string;
}
export type YearLevelFactory = Factory<{
    props: YearLevelProps;
    ref: HTMLDivElement;
    stylesNames: YearLevelStylesNames;
}>;
export declare const YearLevel: import("@mantine/core").MantineComponent<{
    props: YearLevelProps;
    ref: HTMLDivElement;
    stylesNames: YearLevelStylesNames;
}>;
