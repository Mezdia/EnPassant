import { Dayjs } from 'dayjs';
import { DateStringValue, DateTimeStringValue } from '../../types';
type ExactOptionalReturn<T, MainType> = T extends undefined ? undefined : T extends null ? null : MainType;
export declare function toDateString<T extends string | number | Date | Dayjs | undefined | null>(value: T): ExactOptionalReturn<T, DateStringValue>;
export declare function toDateTimeString<T extends string | number | Date | Dayjs | undefined | null>(value: T): ExactOptionalReturn<T, DateTimeStringValue>;
export {};
