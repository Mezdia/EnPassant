import { GetStylesApi, ScrollAreaProps } from '@mantine/core';
import type { TimePickerFactory } from './TimePicker';
interface TimePickerContext {
    getStyles: GetStylesApi<TimePickerFactory>;
    maxDropdownContentHeight: number;
    scrollAreaProps: ScrollAreaProps | undefined;
}
export declare const TimePickerProvider: ({ children, value }: {
    value: TimePickerContext;
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, useTimePickerContext: () => TimePickerContext;
export {};
