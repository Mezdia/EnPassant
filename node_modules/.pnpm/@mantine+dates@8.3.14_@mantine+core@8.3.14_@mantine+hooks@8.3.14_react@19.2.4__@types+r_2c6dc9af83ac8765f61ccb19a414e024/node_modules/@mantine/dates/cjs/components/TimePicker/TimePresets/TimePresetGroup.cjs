'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var TimePicker_context = require('../TimePicker.context.cjs');
var isSameTime = require('../utils/is-same-time/is-same-time.cjs');
var TimePresetControl = require('./TimePresetControl.cjs');

function TimePresetGroup({
  value,
  data,
  onChange,
  format,
  amPmLabels,
  withSeconds
}) {
  const ctx = TimePicker_context.useTimePickerContext();
  const items = data.values.map((item) => /* @__PURE__ */ jsxRuntime.jsx(
    TimePresetControl.TimePresetControl,
    {
      value: item,
      format,
      amPmLabels,
      withSeconds,
      active: isSameTime.isSameTime({ time: item, compare: value, withSeconds }),
      onChange
    },
    item
  ));
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { ...ctx.getStyles("presetsGroup"), children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { ...ctx.getStyles("presetsGroupLabel"), children: data.label }),
    /* @__PURE__ */ jsxRuntime.jsx(core.SimpleGrid, { cols: withSeconds ? 2 : 3, spacing: 4, children: items })
  ] });
}
TimePresetGroup.displayName = "@mantine/dates/TimePresetGroup";

exports.TimePresetGroup = TimePresetGroup;
//# sourceMappingURL=TimePresetGroup.cjs.map
