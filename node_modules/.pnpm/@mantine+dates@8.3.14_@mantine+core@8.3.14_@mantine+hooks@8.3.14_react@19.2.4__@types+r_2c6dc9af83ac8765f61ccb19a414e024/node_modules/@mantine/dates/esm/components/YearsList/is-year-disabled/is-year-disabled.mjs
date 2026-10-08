'use client';
import dayjs from 'dayjs';

function isYearDisabled({ year, minDate, maxDate }) {
  if (!minDate && !maxDate) {
    return false;
  }
  if (minDate && dayjs(year).isBefore(minDate, "year")) {
    return true;
  }
  if (maxDate && dayjs(year).isAfter(maxDate, "year")) {
    return true;
  }
  return false;
}

export { isYearDisabled };
//# sourceMappingURL=is-year-disabled.mjs.map
