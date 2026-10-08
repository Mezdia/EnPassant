import { DatePickerType, DatesRangeValue, DateValue } from '../../types';
export type HiddenDatesInputValue = DatesRangeValue | DateValue | DateValue[];
export interface HiddenDatesInputProps {
    value: HiddenDatesInputValue;
    type: DatePickerType;
    name: string | undefined;
    form: string | undefined;
    withTime?: boolean;
}
export declare function HiddenDatesInput({ value, type, name, form, withTime, }: HiddenDatesInputProps): import("react/jsx-runtime").JSX.Element;
export declare namespace HiddenDatesInput {
    var displayName: string;
}
