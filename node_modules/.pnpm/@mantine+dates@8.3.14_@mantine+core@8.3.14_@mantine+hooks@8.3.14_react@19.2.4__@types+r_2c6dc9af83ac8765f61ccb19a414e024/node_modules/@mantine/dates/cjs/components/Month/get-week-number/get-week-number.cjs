'use client';
'use strict';

var dayjs = require('dayjs');
var isoWeek = require('dayjs/plugin/isoWeek.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);
var isoWeek__default = /*#__PURE__*/_interopDefault(isoWeek);

dayjs__default.default.extend(isoWeek__default.default);
function getWeekNumber(week) {
  const monday = week.find((date) => dayjs__default.default(date).day() === 1);
  return dayjs__default.default(monday).isoWeek();
}

exports.getWeekNumber = getWeekNumber;
//# sourceMappingURL=get-week-number.cjs.map
