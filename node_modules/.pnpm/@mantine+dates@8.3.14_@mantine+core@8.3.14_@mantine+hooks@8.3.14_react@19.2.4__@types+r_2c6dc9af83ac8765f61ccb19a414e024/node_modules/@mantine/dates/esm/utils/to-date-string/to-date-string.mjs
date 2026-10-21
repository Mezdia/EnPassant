'use client';
import dayjs from 'dayjs';

function toDateString(value) {
  return value == null || value === "" ? value : dayjs(value).format("YYYY-MM-DD");
}
function toDateTimeString(value) {
  return value == null || value === "" ? value : dayjs(value).format("YYYY-MM-DD HH:mm:ss");
}

export { toDateString, toDateTimeString };
//# sourceMappingURL=to-date-string.mjs.map
