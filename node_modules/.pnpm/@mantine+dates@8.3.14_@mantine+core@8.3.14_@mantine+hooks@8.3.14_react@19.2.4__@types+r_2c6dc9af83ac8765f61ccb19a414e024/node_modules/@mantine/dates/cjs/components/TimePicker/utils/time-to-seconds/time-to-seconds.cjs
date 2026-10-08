'use client';
'use strict';

var padTime = require('../pad-time/pad-time.cjs');

function timeToSeconds(timeStr) {
  const [hours = 0, minutes = 0, seconds = 0] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
function secondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const secs = seconds % 60;
  return {
    timeString: `${padTime.padTime(hours)}:${padTime.padTime(minutes)}:${padTime.padTime(secs)}`,
    hours,
    minutes,
    seconds: secs
  };
}

exports.secondsToTime = secondsToTime;
exports.timeToSeconds = timeToSeconds;
//# sourceMappingURL=time-to-seconds.cjs.map
