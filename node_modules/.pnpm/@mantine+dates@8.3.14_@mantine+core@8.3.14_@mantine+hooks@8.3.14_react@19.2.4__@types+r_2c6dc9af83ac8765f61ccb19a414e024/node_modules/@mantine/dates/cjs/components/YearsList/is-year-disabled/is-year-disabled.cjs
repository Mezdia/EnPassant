'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isYearDisabled({ year, minDate, maxDate }) {
  if (!minDate && !maxDate) {
    return false;
  }
  if (minDate && dayjs__default.default(year).isBefore(minDate, "year")) {
    return true;
  }
  if (maxDate && dayjs__default.default(year).isAfter(maxDate, "year")) {
    return true;
  }
  return false;
}

exports.isYearDisabled = isYearDisabled;
//# sourceMappingURL=is-year-disabled.cjs.map
