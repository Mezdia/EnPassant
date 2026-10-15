'use client';
import { padTime } from '../pad-time/pad-time.mjs';

function convertTo24HourFormat({
  hours,
  minutes,
  seconds,
  amPm,
  amPmLabels,
  withSeconds
}) {
  let _hours = hours;
  if (amPm === amPmLabels.pm && hours !== 12) {
    _hours += 12;
  } else if (amPm === amPmLabels.am && hours === 12) {
    _hours = 0;
  }
  return `${padTime(_hours)}:${padTime(minutes)}${withSeconds ? `:${padTime(seconds || 0)}` : ""}`;
}
function getTimeString({
  hours,
  minutes,
  seconds,
  format,
  withSeconds,
  amPm,
  amPmLabels
}) {
  if (hours === null || minutes === null) {
    return { valid: false, value: "" };
  }
  if (withSeconds && seconds === null) {
    return { valid: false, value: "" };
  }
  if (format === "24h") {
    const value = `${padTime(hours)}:${padTime(minutes)}${withSeconds ? `:${padTime(seconds)}` : ""}`;
    return { valid: true, value };
  }
  if (amPm === null) {
    return { valid: false, value: "" };
  }
  return {
    valid: true,
    value: convertTo24HourFormat({ hours, minutes, seconds, amPm, amPmLabels, withSeconds })
  };
}

export { getTimeString };
//# sourceMappingURL=get-time-string.mjs.map
