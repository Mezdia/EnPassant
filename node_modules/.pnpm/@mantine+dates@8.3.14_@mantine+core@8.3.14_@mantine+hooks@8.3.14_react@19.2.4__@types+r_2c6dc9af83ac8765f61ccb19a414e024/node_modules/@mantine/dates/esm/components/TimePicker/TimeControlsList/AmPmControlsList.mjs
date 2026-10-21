'use client';
import { jsx } from 'react/jsx-runtime';
import { useTimePickerContext } from '../TimePicker.context.mjs';
import { TimeControl } from './TimeControl.mjs';

function AmPmControlsList({ labels, value, onSelect }) {
  const ctx = useTimePickerContext();
  const controls = [labels.am, labels.pm].map((control) => /* @__PURE__ */ jsx(TimeControl, { value: control, active: value === control, onSelect }, control));
  return /* @__PURE__ */ jsx("div", { ...ctx.getStyles("controlsList"), children: controls });
}
AmPmControlsList.displayName = "@mantine/dates/AmPmControlsList";

export { AmPmControlsList };
//# sourceMappingURL=AmPmControlsList.mjs.map
