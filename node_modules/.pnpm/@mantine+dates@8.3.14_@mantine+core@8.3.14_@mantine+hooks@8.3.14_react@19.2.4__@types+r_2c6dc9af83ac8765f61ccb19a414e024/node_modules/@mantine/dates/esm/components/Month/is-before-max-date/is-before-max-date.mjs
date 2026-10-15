'use client';
import dayjs from 'dayjs';

function isBeforeMaxDate(date, maxDate) {
  return maxDate ? dayjs(date).isBefore(dayjs(maxDate).add(1, "day"), "day") : true;
}

export { isBeforeMaxDate };
//# sourceMappingURL=is-before-max-date.mjs.map
