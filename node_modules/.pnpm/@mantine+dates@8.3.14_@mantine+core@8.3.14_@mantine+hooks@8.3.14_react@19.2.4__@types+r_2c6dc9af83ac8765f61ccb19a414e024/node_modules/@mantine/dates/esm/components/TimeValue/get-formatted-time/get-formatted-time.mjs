'use client';
import { padTime } from '../../TimePicker/utils/pad-time/pad-time.mjs';
import { splitTimeString } from '../../TimePicker/utils/split-time-string/split-time-string.mjs';

function getTimeFromDate(date, withSeconds) {
  return `${date.getHours()}:${date.getMinutes()}${withSeconds ? `:${date.getSeconds()}` : ""}`;
}
function getFormattedTime({
  value,
  format,
  amPmLabels,
  withSeconds
}) {
  const splitted = splitTimeString(
    typeof value === "string" ? value : getTimeFromDate(value, withSeconds)
  );
  if (splitted.hours === null || splitted.minutes === null) {
    return null;
  }
  if (format === "24h") {
    return `${padTime(splitted.hours)}:${padTime(splitted.minutes)}${withSeconds ? `:${padTime(splitted.seconds || 0)}` : ""}`;
  }
  const isPm = splitted.hours >= 12;
  const hours = splitted.hours % 12 === 0 ? 12 : splitted.hours % 12;
  return `${hours}:${padTime(splitted.minutes)}${withSeconds ? `:${padTime(splitted.seconds || 0)}` : ""} ${isPm ? amPmLabels.pm : amPmLabels.am}`;
}

export { getFormattedTime };
//# sourceMappingURL=get-formatted-time.mjs.map
