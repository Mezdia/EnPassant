import { DateStringValue } from '../../../types';
interface IsDateValid {
    date: DateStringValue | Date;
    maxDate: DateStringValue | Date | null | undefined;
    minDate: DateStringValue | Date | null | undefined;
}
export declare function isDateValid({ date, maxDate, minDate }: IsDateValid): boolean;
export {};
