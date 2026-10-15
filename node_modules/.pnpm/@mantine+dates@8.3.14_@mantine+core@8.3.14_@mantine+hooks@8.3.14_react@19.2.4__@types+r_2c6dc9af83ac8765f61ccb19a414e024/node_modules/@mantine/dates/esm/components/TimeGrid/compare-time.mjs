'use client';
import { timeToSeconds } from '../TimePicker/utils/time-to-seconds/time-to-seconds.mjs';

function isTimeBefore(value, compareTo) {
  return timeToSeconds(value) < timeToSeconds(compareTo);
}
function isTimeAfter(value, compareTo) {
  return timeToSeconds(value) > timeToSeconds(compareTo);
}

export { isTimeAfter, isTimeBefore };
//# sourceMappingURL=compare-time.mjs.map
