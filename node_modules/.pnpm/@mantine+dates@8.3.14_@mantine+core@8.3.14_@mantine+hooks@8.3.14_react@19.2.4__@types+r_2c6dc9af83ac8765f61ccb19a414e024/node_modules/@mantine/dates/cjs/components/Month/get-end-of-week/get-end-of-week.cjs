'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getEndOfWeek(date, firstDayOfWeek = 1) {
  let value = dayjs__default.default(date);
  if (!value.isValid()) {
    return value;
  }
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  while (value.day() !== lastDayOfWeek) {
    value = value.add(1, "day");
  }
  return value.format("YYYY-MM-DD");
}

exports.getEndOfWeek = getEndOfWeek;
//# sourceMappingURL=get-end-of-week.cjs.map
