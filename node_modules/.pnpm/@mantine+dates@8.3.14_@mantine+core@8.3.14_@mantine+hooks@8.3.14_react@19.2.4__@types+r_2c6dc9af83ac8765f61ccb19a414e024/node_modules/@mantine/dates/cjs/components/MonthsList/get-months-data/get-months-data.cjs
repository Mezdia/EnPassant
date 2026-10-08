'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getMonthsData(year) {
  const startOfYear = dayjs__default.default(year).startOf("year").toDate();
  const results = [[], [], [], []];
  let currentMonthIndex = 0;
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      results[i].push(dayjs__default.default(startOfYear).add(currentMonthIndex, "months").format("YYYY-MM-DD"));
      currentMonthIndex += 1;
    }
  }
  return results;
}

exports.getMonthsData = getMonthsData;
//# sourceMappingURL=get-months-data.cjs.map
