import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { DateStringValue } from '../../types';
import { LevelsGroupStylesNames } from '../LevelsGroup';
import { YearLevelSettings, YearLevelStylesNames } from '../YearLevel';
export type YearLevelGroupStylesNames = YearLevelStylesNames | LevelsGroupStylesNames;
export interface YearLevelGroupProps extends BoxProps, Omit<YearLevelSettings, 'withPrevious' | 'withNext' | '__onControlKeyDown' | '__getControlRef'>, Omit<StylesApiProps<YearLevelGroupFactory>, 'classNames' | 'styles'>, ElementProps<'div'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    /** Number of columns displayed next to each other */
    numberOfColumns?: number;
    /** Displayed year */
    year: DateStringValue;
    /** Function that returns level control `aria-label` */
    levelControlAriaLabel?: ((year: DateStringValue) => string) | string;
}
export type YearLevelGroupFactory = Factory<{
    props: YearLevelGroupProps;
    ref: HTMLDivElement;
    stylesNames: YearLevelGroupStylesNames;
}>;
export declare const YearLevelGroup: import("@mantine/core").MantineComponent<{
    props: YearLevelGroupProps;
    ref: HTMLDivElement;
    stylesNames: YearLevelGroupStylesNames;
}>;
