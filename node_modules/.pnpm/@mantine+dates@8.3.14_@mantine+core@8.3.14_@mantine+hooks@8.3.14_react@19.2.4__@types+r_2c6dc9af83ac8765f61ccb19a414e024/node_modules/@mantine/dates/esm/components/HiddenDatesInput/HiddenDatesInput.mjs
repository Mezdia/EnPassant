'use client';
import { jsx } from 'react/jsx-runtime';
import 'dayjs';
import { toDateTimeString, toDateString } from '../../utils/to-date-string/to-date-string.mjs';

function formatValue({ value, type, withTime }) {
  const formatter = withTime ? toDateTimeString : toDateString;
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
  return /* @__PURE__ */ jsx("input", { type: "hidden", value: formatValue({ value, type, withTime }), name, form });
}
HiddenDatesInput.displayName = "@mantine/dates/HiddenDatesInput";

export { HiddenDatesInput };
//# sourceMappingURL=HiddenDatesInput.mjs.map
