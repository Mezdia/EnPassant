import { BoxProps, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
export type CalendarHeaderStylesNames = 'calendarHeader' | 'calendarHeaderControl' | 'calendarHeaderLevel' | 'calendarHeaderControlIcon';
export type CalendarHeaderCssVariables = {
    calendarHeader: '--dch-control-size' | '--dch-fz';
};
export interface CalendarHeaderSettings {
    __preventFocus?: boolean;
    /** Determines whether propagation for `Escape` key should be stopped */
    __stopPropagation?: boolean;
    /** Change next icon */
    nextIcon?: React.ReactNode;
    /** Change previous icon */
    previousIcon?: React.ReactNode;
    /** Next button `aria-label` */
    nextLabel?: string;
    /** Previous button `aria-label` */
    previousLabel?: string;
    /** Called when the next button is clicked */
    onNext?: () => void;
    /** Called when the previous button is clicked */
    onPrevious?: () => void;
    /** Called when the level button is clicked */
    onLevelClick?: () => void;
    /** Disables next control */
    nextDisabled?: boolean;
    /** Disables previous control */
    previousDisabled?: boolean;
    /** Determines whether next level button should be enabled @default `true` */
    hasNextLevel?: boolean;
    /** Determines whether next control should be rendered @default `true` */
    withNext?: boolean;
    /** Determines whether previous control should be rendered @default `true` */
    withPrevious?: boolean;
    /** Component size */
    size?: MantineSize;
    /** Controls order @default `['previous', 'level', 'next']` */
    headerControlsOrder?: ('previous' | 'next' | 'level')[];
}
export interface CalendarHeaderProps extends BoxProps, CalendarHeaderSettings, StylesApiProps<CalendarHeaderFactory>, ElementProps<'div'> {
    __staticSelector?: string;
    /** Label displayed between next and previous buttons */
    label: React.ReactNode;
    /** Level control `aria-label` */
    levelControlAriaLabel?: string;
}
export type CalendarHeaderFactory = Factory<{
    props: CalendarHeaderProps;
    ref: HTMLDivElement;
    stylesNames: CalendarHeaderStylesNames;
    vars: CalendarHeaderCssVariables;
}>;
export declare const CalendarHeader: import("@mantine/core").MantineComponent<{
    props: CalendarHeaderProps;
    ref: HTMLDivElement;
    stylesNames: CalendarHeaderStylesNames;
    vars: CalendarHeaderCssVariables;
}>;
