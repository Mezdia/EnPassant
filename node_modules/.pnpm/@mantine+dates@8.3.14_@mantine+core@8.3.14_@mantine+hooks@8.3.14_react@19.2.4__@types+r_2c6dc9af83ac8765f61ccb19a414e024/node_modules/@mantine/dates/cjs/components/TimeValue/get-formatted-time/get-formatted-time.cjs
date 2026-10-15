'use client';
'use strict';

var padTime = require('../../TimePicker/utils/pad-time/pad-time.cjs');
var splitTimeString = require('../../TimePicker/utils/split-time-string/split-time-string.cjs');

function getTimeFromDate(date, withSeconds) {
  return `${date.getHours()}:${date.getMinutes()}${withSeconds ? `:${date.getSeconds()}` : ""}`;
}
function getFormattedTime({
  value,
  format,
  amPmLabels,
  withSeconds
}) {
  const splitted = splitTimeString.splitTimeString(
    typeof value === "string" ? value : getTimeFromDate(value, withSeconds)
  );
  if (splitted.hours === null || splitted.minutes === null) {
    return null;
  }
  if (format === "24h") {
    return `${padTime.padTime(splitted.hours)}:${padTime.padTime(splitted.minutes)}${withSeconds ? `:${padTime.padTime(splitted.seconds || 0)}` : ""}`;
  }
  const isPm = splitted.hours >= 12;
  const hours = splitted.hours % 12 === 0 ? 12 : splitted.hours % 12;
  return `${hours}:${padTime.padTime(splitted.minutes)}${withSeconds ? `:${padTime.padTime(splitted.seconds || 0)}` : ""} ${isPm ? amPmLabels.pm : amPmLabels.am}`;
}

exports.getFormattedTime = getFormattedTime;
//# sourceMappingURL=get-formatted-time.cjs.map
