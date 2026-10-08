'use client';
function splitTimeString(timeString) {
  const [hours = null, minutes = null, seconds = null] = timeString.split(":").map(Number);
  return { hours, minutes, seconds };
}

export { splitTimeString };
//# sourceMappingURL=split-time-string.mjs.map
