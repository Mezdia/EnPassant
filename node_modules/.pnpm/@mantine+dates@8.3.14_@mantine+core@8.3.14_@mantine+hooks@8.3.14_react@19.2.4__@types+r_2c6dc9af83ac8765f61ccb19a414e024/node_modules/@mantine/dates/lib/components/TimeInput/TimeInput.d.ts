import { __BaseInputProps, __InputStylesNames, BoxProps, ElementProps, Factory, StylesApiProps } from '@mantine/core';
export interface TimeInputProps extends BoxProps, __BaseInputProps, StylesApiProps<TimeInputFactory>, ElementProps<'input', 'size'> {
    /** Determines whether seconds input should be displayed @default `false` */
    withSeconds?: boolean;
    /** Minimum possible string time, if `withSeconds` is true, time should be in format HH:mm:ss, otherwise HH:mm */
    minTime?: string;
    /** Maximum possible string time, if `withSeconds` is true, time should be in format HH:mm:ss, otherwise HH:mm */
    maxTime?: string;
}
export type TimeInputFactory = Factory<{
    props: TimeInputProps;
    ref: HTMLInputElement;
    stylesNames: __InputStylesNames;
}>;
export declare const TimeInput: import("@mantine/core").MantineComponent<{
    props: TimeInputProps;
    ref: HTMLInputElement;
    stylesNames: __InputStylesNames;
}>;
