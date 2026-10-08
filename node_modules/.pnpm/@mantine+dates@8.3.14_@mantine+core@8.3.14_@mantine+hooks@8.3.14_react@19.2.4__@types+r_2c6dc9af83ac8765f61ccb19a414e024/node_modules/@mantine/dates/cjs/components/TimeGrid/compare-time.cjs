'use client';
'use strict';

var timeToSeconds = require('../TimePicker/utils/time-to-seconds/time-to-seconds.cjs');

function isTimeBefore(value, compareTo) {
  return timeToSeconds.timeToSeconds(value) < timeToSeconds.timeToSeconds(compareTo);
}
function isTimeAfter(value, compareTo) {
  return timeToSeconds.timeToSeconds(value) > timeToSeconds.timeToSeconds(compareTo);
}

exports.isTimeAfter = isTimeAfter;
exports.isTimeBefore = isTimeBefore;
//# sourceMappingURL=compare-time.cjs.map
