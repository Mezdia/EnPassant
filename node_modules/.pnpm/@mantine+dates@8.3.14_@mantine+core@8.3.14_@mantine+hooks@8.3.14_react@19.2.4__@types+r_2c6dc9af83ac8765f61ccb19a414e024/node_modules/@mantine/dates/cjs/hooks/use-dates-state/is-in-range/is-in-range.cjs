'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function isInRange(date, range) {
  const _range = [...range].sort((a, b) => dayjs__default.default(a).isAfter(dayjs__default.default(b)) ? 1 : -1);
  return dayjs__default.default(_range[0]).startOf("day").subtract(1, "ms").isBefore(date) && dayjs__default.default(_range[1]).endOf("day").add(1, "ms").isAfter(date);
}

exports.isInRange = isInRange;
//# sourceMappingURL=is-in-range.cjs.map
