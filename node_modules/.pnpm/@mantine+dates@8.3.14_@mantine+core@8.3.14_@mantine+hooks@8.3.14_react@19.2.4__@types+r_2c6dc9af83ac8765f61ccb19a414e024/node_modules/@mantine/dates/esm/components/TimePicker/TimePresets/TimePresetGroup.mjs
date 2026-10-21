'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { SimpleGrid } from '@mantine/core';
import { useTimePickerContext } from '../TimePicker.context.mjs';
import { isSameTime } from '../utils/is-same-time/is-same-time.mjs';
import { TimePresetControl } from './TimePresetControl.mjs';

function TimePresetGroup({
  value,
  data,
  onChange,
  format,
  amPmLabels,
  withSeconds
}) {
  const ctx = useTimePickerContext();
  const items = data.values.map((item) => /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs("div", { ...ctx.getStyles("presetsGroup"), children: [
    /* @__PURE__ */ jsx("div", { ...ctx.getStyles("presetsGroupLabel"), children: data.label }),
    /* @__PURE__ */ jsx(SimpleGrid, { cols: withSeconds ? 2 : 3, spacing: 4, children: items })
  ] });
}
TimePresetGroup.displayName = "@mantine/dates/TimePresetGroup";

export { TimePresetGroup };
//# sourceMappingURL=TimePresetGroup.mjs.map
