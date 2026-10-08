'use client';
'use strict';

var splitTimeString = require('../split-time-string/split-time-string.cjs');

function convertTimeTo12HourFormat({
  hours,
  minutes,
  seconds,
  amPmLabels
}) {
  if (hours === null) {
    return { hours: null, minutes: null, seconds: null, amPm: null };
  }
  const amPm = hours >= 12 ? amPmLabels.pm : amPmLabels.am;
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return {
    hours: hour12,
    minutes: typeof minutes === "number" ? minutes : null,
    seconds: typeof seconds === "number" ? seconds : null,
    amPm
  };
}
function getParsedTime({ time, format, amPmLabels }) {
  if (time === "") {
    return { hours: null, minutes: null, seconds: null, amPm: null };
  }
  const { hours, minutes, seconds } = splitTimeString.splitTimeString(time);
  const parsed = { hours, minutes, seconds };
  if (format === "12h") {
    return convertTimeTo12HourFormat({ ...parsed, amPmLabels });
  }
  return { ...parsed, amPm: null };
}

exports.convertTimeTo12HourFormat = convertTimeTo12HourFormat;
exports.getParsedTime = getParsedTime;
//# sourceMappingURL=get-parsed-time.cjs.map
