'use client';
'use strict';

var dayjs = require('dayjs');
var isYearDisabled = require('../is-year-disabled/is-year-disabled.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getYearInTabOrder({
  years,
  minDate,
  maxDate,
  getYearControlProps
}) {
  const enabledYears = years.flat().filter(
    (year) => !isYearDisabled.isYearDisabled({ year, minDate, maxDate }) && !getYearControlProps?.(year)?.disabled
  );
  const selectedYear = enabledYears.find((year) => getYearControlProps?.(year)?.selected);
  if (selectedYear) {
    return selectedYear;
  }
  const currentYear = enabledYears.find((year) => dayjs__default.default().isSame(year, "year"));
  if (currentYear) {
    return currentYear;
  }
  return enabledYears[0];
}

exports.getYearInTabOrder = getYearInTabOrder;
//# sourceMappingURL=get-year-in-tab-order.cjs.map
