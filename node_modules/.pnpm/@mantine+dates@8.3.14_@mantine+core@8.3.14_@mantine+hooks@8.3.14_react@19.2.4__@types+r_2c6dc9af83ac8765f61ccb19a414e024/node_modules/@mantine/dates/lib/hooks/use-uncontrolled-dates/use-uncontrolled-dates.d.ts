import { DatePickerType, DatePickerValue, DateStringValue } from '../../types';
interface UseUncontrolledDates<Type extends DatePickerType = 'default'> {
    type: Type;
    value: DatePickerValue<Type> | undefined;
    defaultValue: DatePickerValue<Type> | undefined;
    onChange: ((value: DatePickerValue<Type, DateStringValue>) => void) | undefined;
    withTime?: boolean;
}
export declare const convertDatesValue: (value: any, withTime: boolean) => string | (string | null | undefined)[] | null | undefined;
export declare function useUncontrolledDates<Type extends DatePickerType = 'default'>({ type, value, defaultValue, onChange, withTime, }: UseUncontrolledDates<Type>): any[];
export {};
