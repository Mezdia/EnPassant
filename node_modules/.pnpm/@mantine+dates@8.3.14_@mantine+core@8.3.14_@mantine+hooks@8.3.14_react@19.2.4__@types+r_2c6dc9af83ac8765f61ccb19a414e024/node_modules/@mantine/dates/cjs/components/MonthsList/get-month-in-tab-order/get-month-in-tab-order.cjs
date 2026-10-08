'use client';
'use strict';

var dayjs = require('dayjs');
var isMonthDisabled = require('../is-month-disabled/is-month-disabled.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getMonthInTabOrder({
  months,
  minDate,
  maxDate,
  getMonthControlProps
}) {
  const enabledMonths = months.flat().filter(
    (month) => !isMonthDisabled.isMonthDisabled({ month, minDate, maxDate }) && !getMonthControlProps?.(month)?.disabled
  );
  const selectedMonth = enabledMonths.find((month) => getMonthControlProps?.(month)?.selected);
  if (selectedMonth) {
    return selectedMonth;
  }
  const currentMonth = enabledMonths.find((month) => dayjs__default.default().isSame(month, "month"));
  if (currentMonth) {
    return currentMonth;
  }
  return enabledMonths[0];
}

exports.getMonthInTabOrder = getMonthInTabOrder;
//# sourceMappingURL=get-month-in-tab-order.cjs.map
