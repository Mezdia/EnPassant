'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var TimePicker_context = require('../TimePicker.context.cjs');
var TimeControl = require('./TimeControl.cjs');

function AmPmControlsList({ labels, value, onSelect }) {
  const ctx = TimePicker_context.useTimePickerContext();
  const controls = [labels.am, labels.pm].map((control) => /* @__PURE__ */ jsxRuntime.jsx(TimeControl.TimeControl, { value: control, active: value === control, onSelect }, control));
  return /* @__PURE__ */ jsxRuntime.jsx("div", { ...ctx.getStyles("controlsList"), children: controls });
}
AmPmControlsList.displayName = "@mantine/dates/AmPmControlsList";

exports.AmPmControlsList = AmPmControlsList;
//# sourceMappingURL=AmPmControlsList.cjs.map
