'use client';
import dayjs from 'dayjs';

function getStartOfWeek(date, firstDayOfWeek = 1) {
  let value = dayjs(date);
  while (value.day() !== firstDayOfWeek) {
    value = value.subtract(1, "day");
  }
  return value.format("YYYY-MM-DD");
}

export { getStartOfWeek };
//# sourceMappingURL=get-start-of-week.mjs.map
