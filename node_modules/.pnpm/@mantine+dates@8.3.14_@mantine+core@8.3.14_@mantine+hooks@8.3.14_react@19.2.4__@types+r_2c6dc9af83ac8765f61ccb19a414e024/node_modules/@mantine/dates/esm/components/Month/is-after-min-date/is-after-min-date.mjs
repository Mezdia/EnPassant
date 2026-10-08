'use client';
import dayjs from 'dayjs';

function isAfterMinDate(date, minDate) {
  return minDate ? dayjs(date).isAfter(dayjs(minDate).subtract(1, "day"), "day") : true;
}

export { isAfterMinDate };
//# sourceMappingURL=is-after-min-date.mjs.map
