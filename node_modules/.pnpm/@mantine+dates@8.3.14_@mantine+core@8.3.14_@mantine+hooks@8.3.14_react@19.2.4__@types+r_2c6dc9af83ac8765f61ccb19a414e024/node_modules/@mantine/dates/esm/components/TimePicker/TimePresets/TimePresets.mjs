'use client';
import { jsx } from 'react/jsx-runtime';
import { ScrollArea, SimpleGrid } from '@mantine/core';
import { useTimePickerContext } from '../TimePicker.context.mjs';
import { isSameTime } from '../utils/is-same-time/is-same-time.mjs';
import { TimePresetControl } from './TimePresetControl.mjs';
import { TimePresetGroup } from './TimePresetGroup.mjs';

function TimePresets({
  presets,
  format,
  amPmLabels,
  withSeconds,
  value,
  onChange
}) {
  const ctx = useTimePickerContext();
  if (presets.length === 0) {
    return null;
  }
  if (typeof presets[0] === "string") {
    const items = presets.map((item) => /* @__PURE__ */ jsx(
      TimePresetControl,
      {
        value: item,
        format,
        amPmLabels,
        withSeconds,
        active: isSameTime({ time: item, compare: value, withSeconds }),
        onChange
      },
      item
    ));
    return /* @__PURE__ */ jsx(
      ScrollArea.Autosize,
      {
        mah: ctx.maxDropdownContentHeight,
        type: "never",
        ...ctx.getStyles("scrollarea"),
        ...ctx.scrollAreaProps,
        children: /* @__PURE__ */ jsx("div", { ...ctx.getStyles("presetsRoot"), children: /* @__PURE__ */ jsx(SimpleGrid, { cols: withSeconds ? 2 : 3, spacing: 4, children: items }) })
      }
    );
  }
  const groups = presets.map((group, index) => /* @__PURE__ */ jsx(
    TimePresetGroup,
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
  return /* @__PURE__ */ jsx(
    ScrollArea.Autosize,
    {
      mah: ctx.maxDropdownContentHeight,
      type: "never",
      ...ctx.getStyles("scrollarea"),
      ...ctx.scrollAreaProps,
      children: /* @__PURE__ */ jsx("div", { ...ctx.getStyles("presetsRoot"), children: groups })
    }
  );
}
TimePresets.displayName = "@mantine/dates/TimePresets";

export { TimePresets };
//# sourceMappingURL=TimePresets.mjs.map
