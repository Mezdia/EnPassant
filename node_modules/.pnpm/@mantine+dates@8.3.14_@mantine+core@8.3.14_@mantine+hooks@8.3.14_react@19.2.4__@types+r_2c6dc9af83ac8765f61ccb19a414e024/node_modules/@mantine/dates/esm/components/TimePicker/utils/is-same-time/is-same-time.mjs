'use client';
import { splitTimeString } from '../split-time-string/split-time-string.mjs';

function isSameTime({ time, compare, withSeconds }) {
  const timeParts = splitTimeString(time);
  const compareParts = splitTimeString(compare);
  if (withSeconds) {
    return timeParts.hours === compareParts.hours && timeParts.minutes === compareParts.minutes && timeParts.seconds === compareParts.seconds;
  }
  return timeParts.hours === compareParts.hours && timeParts.minutes === compareParts.minutes;
}

export { isSameTime };
//# sourceMappingURL=is-same-time.mjs.map
