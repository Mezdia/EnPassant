'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isMonthDisabled({ month, minDate, maxDate }) {
  if (!minDate && !maxDate) {
    return false;
  }
  if (minDate && dayjs__default.default(month).isBefore(minDate, "month")) {
    return true;
  }
  if (maxDate && dayjs__default.default(month).isAfter(maxDate, "month")) {
    return true;
  }
  return false;
}

exports.isMonthDisabled = isMonthDisabled;
//# sourceMappingURL=is-month-disabled.cjs.map
