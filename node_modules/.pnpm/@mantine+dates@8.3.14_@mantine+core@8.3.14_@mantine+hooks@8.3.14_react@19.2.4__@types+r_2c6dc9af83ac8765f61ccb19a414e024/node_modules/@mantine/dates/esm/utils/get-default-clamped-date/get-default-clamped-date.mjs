'use client';
import dayjs from 'dayjs';
import { toDateString } from '../to-date-string/to-date-string.mjs';

function getDefaultClampedDate({
  minDate,
  maxDate
}) {
  const today = dayjs();
  if (!minDate && !maxDate) {
    return toDateString(today);
  }
  if (minDate && dayjs(today).isBefore(minDate)) {
    return toDateString(minDate);
  }
  if (maxDate && dayjs(today).isAfter(maxDate)) {
    return toDateString(maxDate);
  }
  return toDateString(today);
}

export { getDefaultClampedDate };
//# sourceMappingURL=get-default-clamped-date.mjs.map
