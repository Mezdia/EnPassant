'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var TimePicker_context = require('../TimePicker.context.cjs');
var padTime = require('../utils/pad-time/pad-time.cjs');

function TimeControl({ value, active, onSelect }) {
  const ctx = TimePicker_context.useTimePickerContext();
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.UnstyledButton,
    {
      mod: { active },
      onClick: () => onSelect(value),
      onMouseDown: (event) => event.preventDefault(),
      "data-value": value,
      tabIndex: -1,
      ...ctx.getStyles("control"),
      children: typeof value === "number" ? padTime.padTime(value) : value
    }
  );
}
TimeControl.displayName = "@mantine/dates/TimeControl";

exports.TimeControl = TimeControl;
//# sourceMappingURL=TimeControl.cjs.map
