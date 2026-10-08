import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { DateStringValue } from '../../types';
import { CalendarHeaderSettings, CalendarHeaderStylesNames } from '../CalendarHeader';
import { YearsListSettings, YearsListStylesNames } from '../YearsList';
export type DecadeLevelStylesNames = YearsListStylesNames | CalendarHeaderStylesNames;
export interface DecadeLevelBaseSettings extends YearsListSettings {
    /** `dayjs` format for decade label or a function that returns decade label based on the date value @default `"YYYY"` */
    decadeLabelFormat?: string | ((startOfDecade: DateStringValue, endOfDecade: DateStringValue) => React.ReactNode);
}
export interface DecadeLevelSettings extends DecadeLevelBaseSettings, Omit<CalendarHeaderSettings, 'onLevelClick' | 'hasNextLevel'> {
}
export interface DecadeLevelProps extends BoxProps, DecadeLevelSettings, Omit<StylesApiProps<DecadeLevelFactory>, 'classNames' | 'styles'>, ElementProps<'div'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    /** Displayed decade */
    decade: DateStringValue;
    /** Level control `aria-label` */
    levelControlAriaLabel?: string;
}
export type DecadeLevelFactory = Factory<{
    props: DecadeLevelProps;
    ref: HTMLDivElement;
    stylesNames: DecadeLevelStylesNames;
}>;
export declare const DecadeLevel: import("@mantine/core").MantineComponent<{
    props: DecadeLevelProps;
    ref: HTMLDivElement;
    stylesNames: DecadeLevelStylesNames;
}>;
