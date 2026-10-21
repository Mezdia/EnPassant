import type { DateLabelFormat, DayOfWeek } from '../../../types';
interface GetWeekdaysNamesInput {
    locale: string;
    format?: DateLabelFormat;
    firstDayOfWeek?: DayOfWeek;
}
export declare function getWeekdayNames({ locale, format, firstDayOfWeek, }: GetWeekdaysNamesInput): import("react").ReactNode[];
export {};
