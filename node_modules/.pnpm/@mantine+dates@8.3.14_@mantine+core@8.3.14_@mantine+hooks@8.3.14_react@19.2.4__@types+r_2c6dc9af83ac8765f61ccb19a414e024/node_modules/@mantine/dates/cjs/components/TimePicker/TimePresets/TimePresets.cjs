'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var TimePicker_context = require('../TimePicker.context.cjs');
var isSameTime = require('../utils/is-same-time/is-same-time.cjs');
var TimePresetControl = require('./TimePresetControl.cjs');
var TimePresetGroup = require('./TimePresetGroup.cjs');

function TimePresets({
  presets,
  format,
  amPmLabels,
  withSeconds,
  value,
  onChange
}) {
  const ctx = TimePicker_context.useTimePickerContext();
  if (presets.length === 0) {
    return null;
  }
  if (typeof presets[0] === "string") {
    const items = presets.map((item) => /* @__PURE__ */ jsxRuntime.jsx(
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
    return /* @__PURE__ */ jsxRuntime.jsx(
      core.ScrollArea.Autosize,
      {
        mah: ctx.maxDropdownContentHeight,
        type: "never",
        ...ctx.getStyles("scrollarea"),
        ...ctx.scrollAreaProps,
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { ...ctx.getStyles("presetsRoot"), children: /* @__PURE__ */ jsxRuntime.jsx(core.SimpleGrid, { cols: withSeconds ? 2 : 3, spacing: 4, children: items }) })
      }
    );
  }
  const groups = presets.map((group, index) => /* @__PURE__ */ jsxRuntime.jsx(
    TimePresetGroup.TimePresetGroup,
    {
      data: group,
      value,
      format,
      amPmLabels,
      withSeconds,
      onChange
    },
    index
  ));
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.ScrollArea.Autosize,
    {
      mah: ctx.maxDropdownContentHeight,
      type: "never",
      ...ctx.getStyles("scrollarea"),
      ...ctx.scrollAreaProps,
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { ...ctx.getStyles("presetsRoot"), children: groups })
    }
  );
}
TimePresets.displayName = "@mantine/dates/TimePresets";

exports.TimePresets = TimePresets;
//# sourceMappingURL=TimePresets.cjs.map
