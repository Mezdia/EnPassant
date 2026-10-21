'use client';
'use strict';

var timeToSeconds = require('../time-to-seconds/time-to-seconds.cjs');

function getTimeRange({ startTime, endTime, interval }) {
  const timeRange = [];
  const startInSeconds = timeToSeconds.timeToSeconds(startTime);
  const endInSeconds = timeToSeconds.timeToSeconds(endTime);
  const intervalInSeconds = timeToSeconds.timeToSeconds(interval);
  for (let current = startInSeconds; current <= endInSeconds; current += intervalInSeconds) {
    timeRange.push(timeToSeconds.secondsToTime(current).timeString);
  }
  return timeRange;
}

exports.getTimeRange = getTimeRange;
//# sourceMappingURL=get-time-range.cjs.map
