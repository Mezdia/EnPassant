import { DateStringValue } from '../../../types';
interface IsYearDisabledInput {
    year: DateStringValue;
    minDate: DateStringValue | Date | undefined;
    maxDate: DateStringValue | Date | undefined;
}
export declare function isYearDisabled({ year, minDate, maxDate }: IsYearDisabledInput): boolean;
export {};
