'use client';
import { jsx } from 'react/jsx-runtime';
import { UnstyledButton } from '@mantine/core';
import { TimeValue } from '../../TimeValue/TimeValue.mjs';
import { useTimePickerContext } from '../TimePicker.context.mjs';

function TimePresetControl({
  value,
  active,
  onChange,
  format,
  amPmLabels,
  withSeconds
}) {
  const ctx = useTimePickerContext();
  return /* @__PURE__ */ jsx(
    UnstyledButton,
    {
      mod: { active },
      onClick: () => onChange(value),
      ...ctx.getStyles("presetControl"),
      children: /* @__PURE__ */ jsx(TimeValue, { withSeconds, value, format, amPmLabels })
    }
  );
}
TimePresetControl.displayName = "@mantine/dates/TimePresetControl";

export { TimePresetControl };
//# sourceMappingURL=TimePresetControl.mjs.map
