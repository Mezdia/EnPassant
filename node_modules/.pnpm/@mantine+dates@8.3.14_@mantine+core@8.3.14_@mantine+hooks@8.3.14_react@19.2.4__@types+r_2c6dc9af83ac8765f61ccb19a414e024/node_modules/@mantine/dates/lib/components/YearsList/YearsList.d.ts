import { BoxProps, DataAttributes, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
import { ControlsGroupSettings, DateStringValue } from '../../types';
import { PickerControlProps } from '../PickerControl';
export type YearsListStylesNames = 'yearsListControl' | 'yearsList' | 'yearsListCell' | 'yearsListRow';
export interface YearsListSettings extends ControlsGroupSettings {
    /** Prevents focus shift when buttons are clicked */
    __preventFocus?: boolean;
    /** Determines whether propagation for Escape key should be stopped */
    __stopPropagation?: boolean;
    /** dayjs format for years list @default `'YYYY'` */
    yearsListFormat?: string;
    /** Passes props down to year picker control based on date */
    getYearControlProps?: (date: DateStringValue) => Partial<PickerControlProps> & DataAttributes;
    /** Component size */
    size?: MantineSize;
    /** Determines whether controls should be separated @default `true` */
    withCellSpacing?: boolean;
}
export interface YearsListProps extends BoxProps, YearsListSettings, StylesApiProps<YearsListFactory>, ElementProps<'table'> {
    __staticSelector?: string;
    /** Decade value to display */
    decade: DateStringValue;
}
export type YearsListFactory = Factory<{
    props: YearsListProps;
    ref: HTMLTableElement;
    stylesNames: YearsListStylesNames;
}>;
export declare const YearsList: import("@mantine/core").MantineComponent<{
    props: YearsListProps;
    ref: HTMLTableElement;
    stylesNames: YearsListStylesNames;
}>;
