'use client';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';

dayjs.extend(isoWeek);
function getWeekNumber(week) {
  const monday = week.find((date) => dayjs(date).day() === 1);
  return dayjs(monday).isoWeek();
}

export { getWeekNumber };
//# sourceMappingURL=get-week-number.mjs.map
