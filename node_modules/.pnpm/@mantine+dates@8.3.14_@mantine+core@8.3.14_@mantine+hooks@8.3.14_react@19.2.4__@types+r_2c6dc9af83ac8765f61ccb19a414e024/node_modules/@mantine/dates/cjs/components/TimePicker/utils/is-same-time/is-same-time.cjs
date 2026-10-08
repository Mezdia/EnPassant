'use client';
'use strict';

var splitTimeString = require('../split-time-string/split-time-string.cjs');

function isSameTime({ time, compare, withSeconds }) {
  const timeParts = splitTimeString.splitTimeString(time);
  const compareParts = splitTimeString.splitTimeString(compare);
  if (withSeconds) {
    return timeParts.hours === compareParts.hours && timeParts.minutes === compareParts.minutes && timeParts.seconds === compareParts.seconds;
  }
  return timeParts.hours === compareParts.hours && timeParts.minutes === compareParts.minutes;
}

exports.isSameTime = isSameTime;
//# sourceMappingURL=is-same-time.cjs.map
