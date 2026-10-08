'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getStartOfWeek(date, firstDayOfWeek = 1) {
  let value = dayjs__default.default(date);
  while (value.day() !== firstDayOfWeek) {
    value = value.subtract(1, "day");
  }
  return value.format("YYYY-MM-DD");
}

exports.getStartOfWeek = getStartOfWeek;
//# sourceMappingURL=get-start-of-week.cjs.map
