'use client';
'use strict';

var getYearsData = require('../../YearsList/get-years-data/get-years-data.cjs');

function getDecadeRange(decade) {
  const years = getYearsData.getYearsData(decade);
  return [years[0][0], years[3][0]];
}

exports.getDecadeRange = getDecadeRange;
//# sourceMappingURL=get-decade-range.cjs.map
