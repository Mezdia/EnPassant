'use client';
'use strict';

var dayjs = require('dayjs');
var getEndOfWeek = require('../get-end-of-week/get-end-of-week.cjs');
var getStartOfWeek = require('../get-start-of-week/get-start-of-week.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getMonthDays({
  month,
  firstDayOfWeek = 1,
  consistentWeeks
}) {
  const day = dayjs__default.default(month).subtract(dayjs__default.default(month).date() - 1, "day");
  const start = dayjs__default.default(day.format("YYYY-M-D"));
  const startOfMonth = start.format("YYYY-MM-DD");
  const endOfMonth = start.add(+start.daysInMonth() - 1, "day").format("YYYY-MM-DD");
  const endDate = getEndOfWeek.getEndOfWeek(endOfMonth, firstDayOfWeek);
  const weeks = [];
  let date = dayjs__default.default(getStartOfWeek.getStartOfWeek(startOfMonth, firstDayOfWeek));
  while (dayjs__default.default(date).isBefore(endDate, "day")) {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      days.push(date.format("YYYY-MM-DD"));
      date = date.add(1, "day");
    }
    weeks.push(days);
  }
  if (consistentWeeks && weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek[lastWeek.length - 1];
    let nextDay = dayjs__default.default(lastDay).add(1, "day");
    while (weeks.length < 6) {
      const days = [];
      for (let i = 0; i < 7; i += 1) {
        days.push(nextDay.format("YYYY-MM-DD"));
        nextDay = nextDay.add(1, "day");
      }
      weeks.push(days);
    }
  }
  return weeks;
}

exports.getMonthDays = getMonthDays;
//# sourceMappingURL=get-month-days.cjs.map
