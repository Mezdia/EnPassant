import { DateStringValue, DayOfWeek } from '../../../types';
interface GetMonthDaysInput {
    month: DateStringValue;
    firstDayOfWeek: DayOfWeek | undefined;
    consistentWeeks: boolean | undefined;
}
export declare function getMonthDays({ month, firstDayOfWeek, consistentWeeks, }: GetMonthDaysInput): DateStringValue[][];
export {};
