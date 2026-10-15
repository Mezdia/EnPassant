'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isDateValid({ date, maxDate, minDate }) {
  if (date == null) {
    return false;
  }
  if (Number.isNaN(new Date(date).getTime())) {
    return false;
  }
  if (maxDate && dayjs__default.default(date).isAfter(maxDate, "date")) {
    return false;
  }
  if (minDate && dayjs__default.default(date).isBefore(minDate, "date")) {
    return false;
  }
  return true;
}

exports.isDateValid = isDateValid;
//# sourceMappingURL=is-date-valid.cjs.map
