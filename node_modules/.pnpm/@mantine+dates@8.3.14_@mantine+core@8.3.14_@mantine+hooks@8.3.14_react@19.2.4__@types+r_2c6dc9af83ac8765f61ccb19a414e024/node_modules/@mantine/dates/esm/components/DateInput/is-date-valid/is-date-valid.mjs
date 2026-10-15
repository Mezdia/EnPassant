'use client';
import dayjs from 'dayjs';

function isDateValid({ date, maxDate, minDate }) {
  if (date == null) {
    return false;
  }
  if (Number.isNaN(new Date(date).getTime())) {
    return false;
  }
  if (maxDate && dayjs(date).isAfter(maxDate, "date")) {
    return false;
  }
  if (minDate && dayjs(date).isBefore(minDate, "date")) {
    return false;
  }
  return true;
}

export { isDateValid };
//# sourceMappingURL=is-date-valid.mjs.map
