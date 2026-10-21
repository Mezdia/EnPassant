import { DateStringValue } from '../../../types';
import { DayProps } from '../../Day/Day';
interface GetDateInTabOrderInput {
    dates: DateStringValue[][];
    minDate: DateStringValue | undefined;
    maxDate: DateStringValue | undefined;
    getDayProps: ((date: DateStringValue) => Partial<DayProps>) | undefined;
    excludeDate: ((date: DateStringValue) => boolean) | undefined;
    hideOutsideDates: boolean | undefined;
    month: DateStringValue;
}
export declare function getDateInTabOrder({ dates, minDate, maxDate, getDayProps, excludeDate, hideOutsideDates, month, }: GetDateInTabOrderInput): string;
export {};
