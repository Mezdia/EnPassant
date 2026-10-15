'use client';
'use strict';

var dayjs = require('dayjs');
var isAfterMinDate = require('../is-after-min-date/is-after-min-date.cjs');
var isBeforeMaxDate = require('../is-before-max-date/is-before-max-date.cjs');
var isSameMonth = require('../is-same-month/is-same-month.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

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
    (date) => isBeforeMaxDate.isBeforeMaxDate(date, maxDate) && isAfterMinDate.isAfterMinDate(date, minDate) && !excludeDate?.(date) && !getDayProps?.(date)?.disabled && (!hideOutsideDates || isSameMonth.isSameMonth(date, month))
  );
  const selectedDate = enabledDates.find((date) => getDayProps?.(date)?.selected);
  if (selectedDate) {
    return selectedDate;
  }
  const currentDate = enabledDates.find((date) => dayjs__default.default().isSame(date, "date"));
  if (currentDate) {
    return currentDate;
  }
  return enabledDates[0];
}

exports.getDateInTabOrder = getDateInTabOrder;
//# sourceMappingURL=get-date-in-tab-order.cjs.map
