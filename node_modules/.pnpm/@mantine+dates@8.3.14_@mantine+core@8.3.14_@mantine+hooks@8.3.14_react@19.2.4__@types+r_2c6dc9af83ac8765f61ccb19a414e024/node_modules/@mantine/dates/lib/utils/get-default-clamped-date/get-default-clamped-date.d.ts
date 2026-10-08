import { DateStringValue } from '../../types';
interface GetDefaultClampedDate {
    minDate: DateStringValue | Date | undefined;
    maxDate: DateStringValue | Date | undefined;
}
export declare function getDefaultClampedDate({ minDate, maxDate, }: GetDefaultClampedDate): DateStringValue;
export {};
