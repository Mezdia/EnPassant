'use client';
import { timeToSeconds, secondsToTime } from '../time-to-seconds/time-to-seconds.mjs';

function clampTime(time, min, max) {
  const timeInSeconds = timeToSeconds(time);
  const minInSeconds = min ? timeToSeconds(min) : -Infinity;
  const maxInSeconds = max ? timeToSeconds(max) : Infinity;
  const clampedSeconds = Math.max(minInSeconds, Math.min(timeInSeconds, maxInSeconds));
  return secondsToTime(clampedSeconds);
}

export { clampTime };
//# sourceMappingURL=clamp-time.mjs.map
