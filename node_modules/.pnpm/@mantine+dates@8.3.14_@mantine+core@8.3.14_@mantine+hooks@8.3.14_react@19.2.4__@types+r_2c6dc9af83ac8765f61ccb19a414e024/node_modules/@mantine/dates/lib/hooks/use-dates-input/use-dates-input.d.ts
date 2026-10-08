import { DatePickerType, DatePickerValue } from '../../types';
import { DateFormatter } from '../../utils';
interface UseDatesInput<Type extends DatePickerType = 'default'> {
    type: Type;
    value: DatePickerValue<Type> | undefined;
    defaultValue: DatePickerValue<Type> | undefined;
    onChange: ((value: DatePickerValue<Type>) => void) | undefined;
    locale: string | undefined;
    format: string | undefined;
    closeOnChange: boolean | undefined;
    sortDates: boolean | undefined;
    labelSeparator: string | undefined;
    valueFormatter: DateFormatter | undefined;
}
export declare function useDatesInput<Type extends DatePickerType = 'default'>({ type, value, defaultValue, onChange, locale, format, closeOnChange, sortDates, labelSeparator, valueFormatter, }: UseDatesInput<Type>): {
    _value: any;
    setValue: (val: any) => void;
    onClear: () => void;
    shouldClear: boolean;
    formattedValue: string;
    dropdownOpened: boolean;
    dropdownHandlers: import("@mantine/hooks").UseDisclosureHandlers;
};
export {};
