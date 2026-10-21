'use client';
import dayjs from 'dayjs';
import { isAfterMinDate } from '../is-after-min-date/is-after-min-date.mjs';
import { isBeforeMaxDate } from '../is-before-max-date/is-before-max-date.mjs';
import { isSameMonth } from '../is-same-month/is-same-month.mjs';

function getDateInTabOrder({
  dates,
  minDate,
  maxDate,
  getDayProps,
  excludeDate,
  hideOutsideDates,
  month
}) {
  const enabledDates = dates.flat().filter(
    (date) => isBeforeMaxDate(date, maxDate) && isAfterMinDate(date, minDate) && !excludeDate?.(date) && !getDayProps?.(date)?.disabled && (!hideOutsideDates || isSameMonth(date, month))
  );
  const selectedDate = enabledDates.find((date) => getDayProps?.(date)?.selected);
  if (selectedDate) {
    return selectedDate;
  }
  const currentDate = enabledDates.find((date) => dayjs().isSame(date, "date"));
  if (currentDate) {
    return currentDate;
  }
  return enabledDates[0];
}

export { getDateInTabOrder };
//# sourceMappingURL=get-date-in-tab-order.mjs.map
