'use client';
'use strict';

var dayjs = require('dayjs');
var toDateString = require('../to-date-string/to-date-string.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getDefaultClampedDate({
  minDate,
  maxDate
}) {
  const today = dayjs__default.default();
  if (!minDate && !maxDate) {
    return toDateString.toDateString(today);
  }
  if (minDate && dayjs__default.default(today).isBefore(minDate)) {
    return toDateString.toDateString(minDate);
  }
  if (maxDate && dayjs__default.default(today).isAfter(maxDate)) {
    return toDateString.toDateString(maxDate);
  }
  return toDateString.toDateString(today);
}

exports.getDefaultClampedDate = getDefaultClampedDate;
//# sourceMappingURL=get-default-clamped-date.cjs.map
