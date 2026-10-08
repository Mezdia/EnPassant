'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isBeforeMaxDate(date, maxDate) {
  return maxDate ? dayjs__default.default(date).isBefore(dayjs__default.default(maxDate).add(1, "day"), "day") : true;
}

exports.isBeforeMaxDate = isBeforeMaxDate;
//# sourceMappingURL=is-before-max-date.cjs.map
