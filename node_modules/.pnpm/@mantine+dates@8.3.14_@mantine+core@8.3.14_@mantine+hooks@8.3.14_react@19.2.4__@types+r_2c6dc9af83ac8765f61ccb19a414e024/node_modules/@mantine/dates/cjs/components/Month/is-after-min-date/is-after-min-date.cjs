'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isAfterMinDate(date, minDate) {
  return minDate ? dayjs__default.default(date).isAfter(dayjs__default.default(minDate).subtract(1, "day"), "day") : true;
}

exports.isAfterMinDate = isAfterMinDate;
//# sourceMappingURL=is-after-min-date.cjs.map
