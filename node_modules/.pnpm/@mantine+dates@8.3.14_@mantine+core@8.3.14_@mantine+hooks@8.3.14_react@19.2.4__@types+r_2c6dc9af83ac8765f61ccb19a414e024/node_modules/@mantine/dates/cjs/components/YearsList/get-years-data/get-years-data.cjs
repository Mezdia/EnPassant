'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getYearsData(decade) {
  const year = dayjs__default.default(decade).year();
  const rounded = year - year % 10;
  let currentYearIndex = 0;
  const results = [[], [], [], []];
  for (let i = 0; i < 4; i += 1) {
    const max = i === 3 ? 1 : 3;
    for (let j = 0; j < max; j += 1) {
      results[i].push(dayjs__default.default(new Date(rounded + currentYearIndex, 0)).format("YYYY-MM-DD"));
      currentYearIndex += 1;
    }
  }
  return results;
}

exports.getYearsData = getYearsData;
//# sourceMappingURL=get-years-data.cjs.map
