import { DayOfWeek } from '../../types';
export declare function useDatesContext(): {
    getLocale: (input?: string) => string;
    getFirstDayOfWeek: (input?: DayOfWeek) => DayOfWeek;
    getWeekendDays: (input?: DayOfWeek[]) => DayOfWeek[];
    getLabelSeparator: (input?: string) => string;
    locale: string;
    firstDayOfWeek: DayOfWeek;
    weekendDays: DayOfWeek[];
    labelSeparator: string;
    consistentWeeks: boolean;
};
