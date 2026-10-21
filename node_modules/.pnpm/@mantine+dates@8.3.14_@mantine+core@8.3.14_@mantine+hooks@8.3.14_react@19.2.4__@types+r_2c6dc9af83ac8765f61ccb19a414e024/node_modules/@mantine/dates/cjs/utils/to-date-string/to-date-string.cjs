'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function toDateString(value) {
  return value == null || value === "" ? value : dayjs__default.default(value).format("YYYY-MM-DD");
}
function toDateTimeString(value) {
  return value == null || value === "" ? value : dayjs__default.default(value).format("YYYY-MM-DD HH:mm:ss");
}

exports.toDateString = toDateString;
exports.toDateTimeString = toDateTimeString;
//# sourceMappingURL=to-date-string.cjs.map
