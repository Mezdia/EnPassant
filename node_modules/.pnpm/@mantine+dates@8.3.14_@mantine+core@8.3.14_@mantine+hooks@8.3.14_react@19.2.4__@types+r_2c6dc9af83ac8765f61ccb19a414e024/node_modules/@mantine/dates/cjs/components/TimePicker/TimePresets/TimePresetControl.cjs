'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var TimeValue = require('../../TimeValue/TimeValue.cjs');
var TimePicker_context = require('../TimePicker.context.cjs');

function TimePresetControl({
  value,
  active,
  onChange,
  format,
  amPmLabels,
  withSeconds
}) {
  const ctx = TimePicker_context.useTimePickerContext();
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.UnstyledButton,
    {
      mod: { active },
      onClick: () => onChange(value),
      ...ctx.getStyles("presetControl"),
      children: /* @__PURE__ */ jsxRuntime.jsx(TimeValue.TimeValue, { withSeconds, value, format, amPmLabels })
    }
  );
}
TimePresetControl.displayName = "@mantine/dates/TimePresetControl";

exports.TimePresetControl = TimePresetControl;
//# sourceMappingURL=TimePresetControl.cjs.map
