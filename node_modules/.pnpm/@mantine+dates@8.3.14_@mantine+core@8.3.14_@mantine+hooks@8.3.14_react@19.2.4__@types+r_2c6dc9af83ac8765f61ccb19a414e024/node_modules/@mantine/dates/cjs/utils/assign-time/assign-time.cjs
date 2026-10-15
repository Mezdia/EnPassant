'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function assignTime(dateValue, timeString) {
  let date = dateValue ? dayjs__default.default(dateValue) : dayjs__default.default();
  if (timeString === "") {
    return date.format("YYYY-MM-DD HH:mm:ss");
  }
  const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);
  date = date.set("hour", hours);
  date = date.set("minute", minutes);
  date = date.set("second", seconds);
  date = date.set("millisecond", 0);
  return date.format("YYYY-MM-DD HH:mm:ss");
}

exports.assignTime = assignTime;
//# sourceMappingURL=assign-time.cjs.map
