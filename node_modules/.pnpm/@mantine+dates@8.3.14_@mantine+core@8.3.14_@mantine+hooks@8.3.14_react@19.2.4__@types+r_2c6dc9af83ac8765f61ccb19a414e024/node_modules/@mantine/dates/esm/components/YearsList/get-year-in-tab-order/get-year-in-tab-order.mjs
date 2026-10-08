'use client';
import dayjs from 'dayjs';
import { isYearDisabled } from '../is-year-disabled/is-year-disabled.mjs';

function getYearInTabOrder({
  years,
  minDate,
  maxDate,
  getYearControlProps
}) {
  const enabledYears = years.flat().filter(
    (year) => !isYearDisabled({ year, minDate, maxDate }) && !getYearControlProps?.(year)?.disabled
  );
  const selectedYear = enabledYears.find((year) => getYearControlProps?.(year)?.selected);
  if (selectedYear) {
    return selectedYear;
  }
  const currentYear = enabledYears.find((year) => dayjs().isSame(year, "year"));
  if (currentYear) {
    return currentYear;
  }
  return enabledYears[0];
}

export { getYearInTabOrder };
//# sourceMappingURL=get-year-in-tab-order.mjs.map
