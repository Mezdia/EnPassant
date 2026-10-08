'use client';
import dayjs from 'dayjs';
import { isMonthDisabled } from '../is-month-disabled/is-month-disabled.mjs';

function getMonthInTabOrder({
  months,
  minDate,
  maxDate,
  getMonthControlProps
}) {
  const enabledMonths = months.flat().filter(
    (month) => !isMonthDisabled({ month, minDate, maxDate }) && !getMonthControlProps?.(month)?.disabled
  );
  const selectedMonth = enabledMonths.find((month) => getMonthControlProps?.(month)?.selected);
  if (selectedMonth) {
    return selectedMonth;
  }
  const currentMonth = enabledMonths.find((month) => dayjs().isSame(month, "month"));
  if (currentMonth) {
    return currentMonth;
  }
  return enabledMonths[0];
}

export { getMonthInTabOrder };
//# sourceMappingURL=get-month-in-tab-order.mjs.map
