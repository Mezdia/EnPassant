'use client';
import dayjs from 'dayjs';

function assignTime(dateValue, timeString) {
  let date = dateValue ? dayjs(dateValue) : dayjs();
  if (timeString === "") {
    return date.format("YYYY-MM-DD HH:mm:ss");
  }
  const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);
  date = date.set("hour", hours);
  date = date.set("minute", minutes);
  date = date.set("second", seconds);
  date = date.set("millisecond", 0);
  return date.format("YYYY-MM-DD HH:mm:ss");
}

export { assignTime };
//# sourceMappingURL=assign-time.mjs.map
