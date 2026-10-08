'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isSameMonth(date, comparison) {
  return dayjs__default.default(date).format("YYYY-MM") === dayjs__default.default(comparison).format("YYYY-MM");
}

exports.isSameMonth = isSameMonth;
//# sourceMappingURL=is-same-month.cjs.map
