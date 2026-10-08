'use client';
import { timeToSeconds, secondsToTime } from '../time-to-seconds/time-to-seconds.mjs';

function getTimeRange({ startTime, endTime, interval }) {
  const timeRange = [];
  const startInSeconds = timeToSeconds(startTime);
  const endInSeconds = timeToSeconds(endTime);
  const intervalInSeconds = timeToSeconds(interval);
  for (let current = startInSeconds; current <= endInSeconds; current += intervalInSeconds) {
    timeRange.push(secondsToTime(current).timeString);
  }
  return timeRange;
}

export { getTimeRange };
//# sourceMappingURL=get-time-range.mjs.map
