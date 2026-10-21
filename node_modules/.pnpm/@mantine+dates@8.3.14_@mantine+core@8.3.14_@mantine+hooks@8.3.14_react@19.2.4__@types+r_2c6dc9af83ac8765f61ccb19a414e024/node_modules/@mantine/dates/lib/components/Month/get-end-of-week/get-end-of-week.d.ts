import dayjs from 'dayjs';
import type { DateStringValue, DayOfWeek } from '../../../types';
export declare function getEndOfWeek(date: DateStringValue, firstDayOfWeek?: DayOfWeek): string | dayjs.Dayjs;
