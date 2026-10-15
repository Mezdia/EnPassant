'use client';
import dayjs from 'dayjs';
import { toDateTimeString } from '../to-date-string/to-date-string.mjs';

function clampDate(minDate, maxDate, date) {
  if (!minDate && !maxDate) {
    return toDateTimeString(date);
  }
  if (minDate && dayjs(date).isBefore(minDate)) {
    return toDateTimeString(minDate);
  }
  if (maxDate && dayjs(date).isAfter(maxDate)) {
    return toDateTimeString(maxDate);
  }
  return toDateTimeString(date);
}

export { clampDate };
//# sourceMappingURL=clamp-date.mjs.map
