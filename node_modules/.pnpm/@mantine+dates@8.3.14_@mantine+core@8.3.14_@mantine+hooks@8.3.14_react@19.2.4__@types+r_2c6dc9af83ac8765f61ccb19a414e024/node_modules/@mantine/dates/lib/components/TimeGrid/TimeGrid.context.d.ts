import { GetStylesApi } from '@mantine/core';
import type { TimeGridFactory } from './TimeGrid';
interface TimeGridContextValue {
    getStyles: GetStylesApi<TimeGridFactory>;
}
export declare const TimeGridProvider: ({ children, value }: {
    value: TimeGridContextValue;
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element, useTimeGridContext: () => TimeGridContextValue;
export {};
