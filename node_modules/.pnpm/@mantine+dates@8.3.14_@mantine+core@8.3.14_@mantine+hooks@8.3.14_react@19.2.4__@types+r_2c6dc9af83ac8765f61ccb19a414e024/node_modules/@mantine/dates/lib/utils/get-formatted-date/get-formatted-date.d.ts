import { DatePickerType, DatePickerValue } from '../../types';
interface DateFormatterInput {
    type: DatePickerType;
    date: DatePickerValue<DatePickerType>;
    locale: string;
    format: string;
    labelSeparator: string;
}
export type DateFormatter = (input: DateFormatterInput) => string;
export declare function defaultDateFormatter({ type, date, locale, format, labelSeparator, }: DateFormatterInput): string;
interface GetFormattedDateInput extends DateFormatterInput {
    formatter?: DateFormatter;
}
export declare function getFormattedDate({ formatter, ...others }: GetFormattedDateInput): string;
export {};
