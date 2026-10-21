'use client';
'use strict';

var padTime = require('../pad-time/pad-time.cjs');

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
  return `${padTime.padTime(_hours)}:${padTime.padTime(minutes)}${withSeconds ? `:${padTime.padTime(seconds || 0)}` : ""}`;
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
    const value = `${padTime.padTime(hours)}:${padTime.padTime(minutes)}${withSeconds ? `:${padTime.padTime(seconds)}` : ""}`;
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

exports.getTimeString = getTimeString;
//# sourceMappingURL=get-time-string.cjs.map
