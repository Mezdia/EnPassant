import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { DateStringValue } from '../../types';
import { LevelsGroupStylesNames } from '../LevelsGroup';
import { MonthLevelSettings, MonthLevelStylesNames } from '../MonthLevel';
export type MonthLevelGroupStylesNames = MonthLevelStylesNames | LevelsGroupStylesNames;
export interface MonthLevelGroupProps extends BoxProps, Omit<MonthLevelSettings, 'withPrevious' | 'withNext' | '__onDayKeyDown' | '__getDayRef'>, Omit<StylesApiProps<MonthLevelGroupFactory>, 'classNames' | 'styles'>, ElementProps<'div'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    /** Number of columns to display next to each other */
    numberOfColumns?: number;
    /** Month to display */
    month: DateStringValue;
    /** Function that returns level control `aria-label` based on month date */
    levelControlAriaLabel?: ((month: DateStringValue) => string) | string;
    /** Passed as `isStatic` prop to `Month` component */
    static?: boolean;
}
export type MonthLevelGroupFactory = Factory<{
    props: MonthLevelGroupProps;
    ref: HTMLDivElement;
    stylesNames: MonthLevelGroupStylesNames;
}>;
export declare const MonthLevelGroup: import("@mantine/core").MantineComponent<{
    props: MonthLevelGroupProps;
    ref: HTMLDivElement;
    stylesNames: MonthLevelGroupStylesNames;
}>;
