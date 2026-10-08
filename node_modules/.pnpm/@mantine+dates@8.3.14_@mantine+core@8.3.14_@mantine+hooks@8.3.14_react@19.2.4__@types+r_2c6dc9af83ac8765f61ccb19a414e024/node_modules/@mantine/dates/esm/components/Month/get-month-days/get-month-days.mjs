'use client';
import dayjs from 'dayjs';
import { getEndOfWeek } from '../get-end-of-week/get-end-of-week.mjs';
import { getStartOfWeek } from '../get-start-of-week/get-start-of-week.mjs';

function getMonthDays({
  month,
  firstDayOfWeek = 1,
  consistentWeeks
}) {
  const day = dayjs(month).subtract(dayjs(month).date() - 1, "day");
  const start = dayjs(day.format("YYYY-M-D"));
  const startOfMonth = start.format("YYYY-MM-DD");
  const endOfMonth = start.add(+start.daysInMonth() - 1, "day").format("YYYY-MM-DD");
  const endDate = getEndOfWeek(endOfMonth, firstDayOfWeek);
  const weeks = [];
  let date = dayjs(getStartOfWeek(startOfMonth, firstDayOfWeek));
  while (dayjs(date).isBefore(endDate, "day")) {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      days.push(date.format("YYYY-MM-DD"));
      date = date.add(1, "day");
    }
    weeks.push(days);
  }
  if (consistentWeeks && weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek[lastWeek.length - 1];
    let nextDay = dayjs(lastDay).add(1, "day");
    while (weeks.length < 6) {
      const days = [];
      for (let i = 0; i < 7; i += 1) {
        days.push(nextDay.format("YYYY-MM-DD"));
        nextDay = nextDay.add(1, "day");
      }
      weeks.push(days);
    }
  }
  return weeks;
}

export { getMonthDays };
//# sourceMappingURL=get-month-days.mjs.map
