import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { DateStringValue } from '../../types';
import { DecadeLevelSettings, DecadeLevelStylesNames } from '../DecadeLevel';
import { LevelsGroupStylesNames } from '../LevelsGroup';
export type DecadeLevelGroupStylesNames = LevelsGroupStylesNames | DecadeLevelStylesNames;
export interface DecadeLevelGroupProps extends BoxProps, Omit<StylesApiProps<DecadeLevelGroupFactory>, 'classNames' | 'styles'>, Omit<DecadeLevelSettings, 'withPrevious' | 'withNext' | '__onControlKeyDown' | '__getControlRef'>, ElementProps<'div'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    /** Number of columns to display next to each other */
    numberOfColumns?: number;
    /** Displayed decade */
    decade: DateStringValue;
    /** Function that returns level control `aria-label` based on year date */
    levelControlAriaLabel?: ((decade: DateStringValue) => string) | string;
}
export type DecadeLevelGroupFactory = Factory<{
    props: DecadeLevelGroupProps;
    ref: HTMLDivElement;
    stylesNames: DecadeLevelGroupStylesNames;
}>;
export declare const DecadeLevelGroup: import("@mantine/core").MantineComponent<{
    props: DecadeLevelGroupProps;
    ref: HTMLDivElement;
    stylesNames: DecadeLevelGroupStylesNames;
}>;
