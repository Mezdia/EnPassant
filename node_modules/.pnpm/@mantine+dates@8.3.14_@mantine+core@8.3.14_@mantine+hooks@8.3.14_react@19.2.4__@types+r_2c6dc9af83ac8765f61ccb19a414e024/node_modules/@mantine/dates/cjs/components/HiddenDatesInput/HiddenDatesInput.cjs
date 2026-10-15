'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('dayjs');
var toDateString = require('../../utils/to-date-string/to-date-string.cjs');

function formatValue({ value, type, withTime }) {
  const formatter = withTime ? toDateString.toDateTimeString : toDateString.toDateString;
  if (type === "range" && Array.isArray(value)) {
    const startDate = formatter(value[0]);
    const endDate = formatter(value[1]);
    if (!startDate) {
      return "";
    }
    if (!endDate) {
      return `${startDate} \u2013`;
    }
    return `${startDate} \u2013 ${endDate}`;
  }
  if (type === "multiple" && Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  if (!Array.isArray(value) && value) {
    return formatter(value);
  }
  return "";
}
function HiddenDatesInput({
  value,
  type,
  name,
  form,
  withTime = false
}) {
  return /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", value: formatValue({ value, type, withTime }), name, form });
}
HiddenDatesInput.displayName = "@mantine/dates/HiddenDatesInput";

exports.HiddenDatesInput = HiddenDatesInput;
//# sourceMappingURL=HiddenDatesInput.cjs.map
