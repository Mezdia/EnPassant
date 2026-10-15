'use client';
import { jsx, Fragment } from 'react/jsx-runtime';
import { getFormattedTime } from './get-formatted-time/get-formatted-time.mjs';

function TimeValue({
  value,
  format = "24h",
  amPmLabels = { am: "AM", pm: "PM" },
  withSeconds = false
}) {
  return /* @__PURE__ */ jsx(Fragment, { children: getFormattedTime({ value, format, amPmLabels, withSeconds }) });
}
TimeValue.displayName = "@mantine/dates/TimeValue";

export { TimeValue };
//# sourceMappingURL=TimeValue.mjs.map
