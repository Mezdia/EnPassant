'use client';
'use strict';

var dayjs = require('dayjs');
var toDateString = require('../to-date-string/to-date-string.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function clampDate(minDate, maxDate, date) {
  if (!minDate && !maxDate) {
    return toDateString.toDateTimeString(date);
  }
  if (minDate && dayjs__default.default(date).isBefore(minDate)) {
    return toDateString.toDateTimeString(minDate);
  }
  if (maxDate && dayjs__default.default(date).isAfter(maxDate)) {
    return toDateString.toDateTimeString(maxDate);
  }
  return toDateString.toDateTimeString(date);
}

exports.clampDate = clampDate;
//# sourceMappingURL=clamp-date.cjs.map
