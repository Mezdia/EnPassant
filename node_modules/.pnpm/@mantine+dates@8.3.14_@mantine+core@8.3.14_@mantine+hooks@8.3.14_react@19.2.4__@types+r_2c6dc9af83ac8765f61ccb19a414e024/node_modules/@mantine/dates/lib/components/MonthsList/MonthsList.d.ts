import { BoxProps, DataAttributes, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
import { ControlsGroupSettings, DateStringValue } from '../../types';
import { PickerControlProps } from '../PickerControl';
export type MonthsListStylesNames = 'monthsList' | 'monthsListCell' | 'monthsListRow' | 'monthsListControl';
export interface MonthsListSettings extends ControlsGroupSettings {
    /** `dayjs` format for months list */
    monthsListFormat?: string;
    /** Passes props down month picker control */
    getMonthControlProps?: (date: DateStringValue) => Partial<PickerControlProps> & DataAttributes;
    /** Determines whether controls should be separated @default `true` */
    withCellSpacing?: boolean;
}
export interface MonthsListProps extends BoxProps, MonthsListSettings, StylesApiProps<MonthsListFactory>, ElementProps<'table'> {
    __staticSelector?: string;
    /** Prevents focus shift when buttons are clicked */
    __preventFocus?: boolean;
    /** Determines whether propagation for Escape key should be stopped */
    __stopPropagation?: boolean;
    /** Year for which months list should be displayed */
    year: DateStringValue;
    /** Component size */
    size?: MantineSize;
}
export type MonthsListFactory = Factory<{
    props: MonthsListProps;
    ref: HTMLTableElement;
    stylesNames: MonthsListStylesNames;
}>;
export declare const MonthsList: import("@mantine/core").MantineComponent<{
    props: MonthsListProps;
    ref: HTMLTableElement;
    stylesNames: MonthsListStylesNames;
}>;
