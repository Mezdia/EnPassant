'use client';
import dayjs from 'dayjs';

function getEndOfWeek(date, firstDayOfWeek = 1) {
  let value = dayjs(date);
  if (!value.isValid()) {
    return value;
  }
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  while (value.day() !== lastDayOfWeek) {
    value = value.add(1, "day");
  }
  return value.format("YYYY-MM-DD");
}

export { getEndOfWeek };
//# sourceMappingURL=get-end-of-week.mjs.map
