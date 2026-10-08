'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getMinTime({ minDate, value }) {
  const minTime = minDate ? dayjs__default.default(minDate).format("HH:mm:ss") : null;
  return value && minDate && value === minDate ? minTime != null ? minTime : void 0 : void 0;
}
function getMaxTime({ maxDate, value }) {
  const maxTime = maxDate ? dayjs__default.default(maxDate).format("HH:mm:ss") : null;
  return value && maxDate && value === maxDate ? maxTime != null ? maxTime : void 0 : void 0;
}

exports.getMaxTime = getMaxTime;
exports.getMinTime = getMinTime;
//# sourceMappingURL=get-min-max-time.cjs.map
