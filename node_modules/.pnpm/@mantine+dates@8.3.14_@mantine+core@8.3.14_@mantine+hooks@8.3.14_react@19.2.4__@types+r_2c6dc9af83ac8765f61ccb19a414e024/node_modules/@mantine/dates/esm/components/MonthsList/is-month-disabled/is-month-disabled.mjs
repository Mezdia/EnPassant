'use client';
import dayjs from 'dayjs';

function isMonthDisabled({ month, minDate, maxDate }) {
  if (!minDate && !maxDate) {
    return false;
  }
  if (minDate && dayjs(month).isBefore(minDate, "month")) {
    return true;
  }
  if (maxDate && dayjs(month).isAfter(maxDate, "month")) {
    return true;
  }
  return false;
}

export { isMonthDisabled };
//# sourceMappingURL=is-month-disabled.mjs.map
