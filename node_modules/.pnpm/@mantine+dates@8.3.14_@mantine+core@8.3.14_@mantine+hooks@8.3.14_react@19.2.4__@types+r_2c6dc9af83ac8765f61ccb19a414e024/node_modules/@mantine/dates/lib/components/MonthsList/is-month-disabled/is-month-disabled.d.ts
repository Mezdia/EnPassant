import { DateStringValue } from '../../../types';
interface IsMonthDisabledInput {
    month: DateStringValue;
    minDate: DateStringValue | undefined;
    maxDate: DateStringValue | undefined;
}
export declare function isMonthDisabled({ month, minDate, maxDate }: IsMonthDisabledInput): boolean;
export {};
