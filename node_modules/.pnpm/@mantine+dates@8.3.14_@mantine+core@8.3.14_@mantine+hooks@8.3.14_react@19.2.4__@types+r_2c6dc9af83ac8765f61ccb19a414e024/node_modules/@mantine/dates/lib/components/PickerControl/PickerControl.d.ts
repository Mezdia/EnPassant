import { BoxProps, ElementProps, Factory, MantineSize, StylesApiProps } from '@mantine/core';
export type PickerControlStylesNames = 'pickerControl';
export type PickerControlCssVariables = {
    pickerControl: '--dpc-size' | '--dpc-fz';
};
export interface PickerControlProps extends BoxProps, StylesApiProps<PickerControlFactory>, ElementProps<'button'> {
    __staticSelector?: string;
    /** Control children */
    children?: React.ReactNode;
    /** Disables control */
    disabled?: boolean;
    /** Assigns selected styles */
    selected?: boolean;
    /** Assigns in range styles */
    inRange?: boolean;
    /** Assigns first in range styles */
    firstInRange?: boolean;
    /** Assigns last in range styles */
    lastInRange?: boolean;
    /** Component size */
    size?: MantineSize;
}
export type PickerControlFactory = Factory<{
    props: PickerControlProps;
    ref: HTMLButtonElement;
    stylesNames: PickerControlStylesNames;
    vars: PickerControlCssVariables;
}>;
export declare const PickerControl: import("@mantine/core").MantineComponent<{
    props: PickerControlProps;
    ref: HTMLButtonElement;
    stylesNames: PickerControlStylesNames;
    vars: PickerControlCssVariables;
}>;
