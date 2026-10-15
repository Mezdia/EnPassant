'use client';
'use strict';

function splitTimeString(timeString) {
  const [hours = null, minutes = null, seconds = null] = timeString.split(":").map(Number);
  return { hours, minutes, seconds };
}

exports.splitTimeString = splitTimeString;
//# sourceMappingURL=split-time-string.cjs.map
