import { BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
import { CalendarLevel, DateStringValue } from '../../types';
import { DecadeLevelSettings } from '../DecadeLevel';
import { DecadeLevelGroupStylesNames } from '../DecadeLevelGroup';
import { MonthLevelSettings } from '../MonthLevel';
import { MonthLevelGroupStylesNames } from '../MonthLevelGroup';
import { YearLevelSettings } from '../YearLevel';
import { YearLevelGroupStylesNames } from '../YearLevelGroup';
export type CalendarStylesNames = MonthLevelGroupStylesNames | YearLevelGroupStylesNames | DecadeLevelGroupStylesNames;
export interface CalendarAriaLabels {
    monthLevelControl?: string;
    yearLevelControl?: string;
    nextMonth?: string;
    previousMonth?: string;
    nextYear?: string;
    previousYear?: string;
    nextDecade?: string;
    previousDecade?: string;
}
type OmittedSettings = 'onNext' | 'onPrevious' | 'onLevelClick' | 'withNext' | 'withPrevious' | 'nextDisabled' | 'previousDisabled' | 'hasNextLevel';
export interface CalendarSettings extends Omit<DecadeLevelSettings, OmittedSettings>, Omit<YearLevelSettings, OmittedSettings>, Omit<MonthLevelSettings, OmittedSettings> {
    /** Initial displayed level in uncontrolled mode */
    defaultLevel?: CalendarLevel;
    /** Current displayed level displayed in controlled mode */
    level?: CalendarLevel;
    /** Called when level changes */
    onLevelChange?: (level: CalendarLevel) => void;
    /** Called when user selects year */
    onYearSelect?: (date: DateStringValue) => void;
    /** Called when user selects month */
    onMonthSelect?: (date: DateStringValue) => void;
    /** Called when mouse enters year control */
    onYearMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>, date: DateStringValue) => void;
    /** Called when mouse enters month control */
    onMonthMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>, date: DateStringValue) => void;
}
export interface CalendarBaseProps {
    __staticSelector?: string;
    /** Prevents focus shift when buttons are clicked */
    __preventFocus?: boolean;
    /** Determines whether date should be updated when year control is clicked */
    __updateDateOnYearSelect?: boolean;
    /** Determines whether date should be updated when month control is clicked */
    __updateDateOnMonthSelect?: boolean;
    /** Assigns function to set date to the given ref */
    __setDateRef?: React.RefObject<((date: DateStringValue) => void) | null>;
    /** Assigns function to set level to the given ref */
    __setLevelRef?: React.RefObject<((level: CalendarLevel) => void) | null>;
    /** Initial displayed date in uncontrolled mode */
    defaultDate?: DateStringValue | Date;
    /** Displayed date in controlled mode */
    date?: DateStringValue | Date;
    /** Called when date changes */
    onDateChange?: (date: DateStringValue) => void;
    /** Number of columns displayed next to each other @default `1` */
    numberOfColumns?: number;
    /** Number of columns to scroll with next/prev buttons, same as `numberOfColumns` if not set explicitly */
    columnsToScroll?: number;
    /** `aria-label` attributes for controls on different levels */
    ariaLabels?: CalendarAriaLabels;
    /** Next button `aria-label` */
    nextLabel?: string;
    /** Previous button `aria-label` */
    previousLabel?: string;
    /** Called when the next decade button is clicked */
    onNextDecade?: (date: DateStringValue) => void;
    /** Called when the previous decade button is clicked */
    onPreviousDecade?: (date: DateStringValue) => void;
    /** Called when the next year button is clicked */
    onNextYear?: (date: DateStringValue) => void;
    /** Called when the previous year button is clicked */
    onPreviousYear?: (date: DateStringValue) => void;
    /** Called when the next month button is clicked */
    onNextMonth?: (date: DateStringValue) => void;
    /** Called when the previous month button is clicked */
    onPreviousMonth?: (date: DateStringValue) => void;
}
export interface CalendarProps extends BoxProps, CalendarSettings, CalendarBaseProps, StylesApiProps<CalendarFactory>, ElementProps<'div'> {
    /** Max level that user can go up to (decade, year, month) @default `'decade'` */
    maxLevel?: CalendarLevel;
    /** Min level that user can go down to (decade, year, month) @default `'month'` */
    minLevel?: CalendarLevel;
    /** Determines whether days should be static, static days can be used to display month if it is not expected that user will interact with the component in any way  */
    static?: boolean;
    /** Enable enhanced keyboard navigation (Ctrl/Cmd + Arrow keys for year navigation, Ctrl/Cmd + Shift + Arrow keys for decade navigation, Y key to open year view) */
    enableKeyboardNavigation?: boolean;
}
export type CalendarFactory = Factory<{
    props: CalendarProps;
    ref: HTMLDivElement;
    stylesNames: CalendarStylesNames;
}>;
export declare const Calendar: import("@mantine/core").MantineComponent<{
    props: CalendarProps;
    ref: HTMLDivElement;
    stylesNames: CalendarStylesNames;
}>;
export {};
