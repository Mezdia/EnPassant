'use client';
import dayjs from 'dayjs';

function getMinTime({ minDate, value }) {
  const minTime = minDate ? dayjs(minDate).format("HH:mm:ss") : null;
  return value && minDate && value === minDate ? minTime != null ? minTime : void 0 : void 0;
}
function getMaxTime({ maxDate, value }) {
  const maxTime = maxDate ? dayjs(maxDate).format("HH:mm:ss") : null;
  return value && maxDate && value === maxDate ? maxTime != null ? maxTime : void 0 : void 0;
}

export { getMaxTime, getMinTime };
//# sourceMappingURL=get-min-max-time.mjs.map
