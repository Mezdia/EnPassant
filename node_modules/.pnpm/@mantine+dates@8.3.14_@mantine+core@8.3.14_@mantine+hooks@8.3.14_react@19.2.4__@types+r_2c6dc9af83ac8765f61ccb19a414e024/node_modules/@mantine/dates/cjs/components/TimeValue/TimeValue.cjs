'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var getFormattedTime = require('./get-formatted-time/get-formatted-time.cjs');

function TimeValue({
  value,
  format = "24h",
  amPmLabels = { am: "AM", pm: "PM" },
  withSeconds = false
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: getFormattedTime.getFormattedTime({ value, format, amPmLabels, withSeconds }) });
}
TimeValue.displayName = "@mantine/dates/TimeValue";

exports.TimeValue = TimeValue;
//# sourceMappingURL=TimeValue.cjs.map
