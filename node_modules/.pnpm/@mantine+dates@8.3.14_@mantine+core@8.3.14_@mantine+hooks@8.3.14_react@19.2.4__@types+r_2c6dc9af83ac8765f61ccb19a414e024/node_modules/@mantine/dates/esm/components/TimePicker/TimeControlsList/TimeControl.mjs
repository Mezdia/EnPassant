'use client';
import { jsx } from 'react/jsx-runtime';
import { UnstyledButton } from '@mantine/core';
import { useTimePickerContext } from '../TimePicker.context.mjs';
import { padTime } from '../utils/pad-time/pad-time.mjs';

function TimeControl({ value, active, onSelect }) {
  const ctx = useTimePickerContext();
  return /* @__PURE__ */ jsx(
    UnstyledButton,
    {
      mod: { active },
      onClick: () => onSelect(value),
      onMouseDown: (event) => event.preventDefault(),
      "data-value": value,
      tabIndex: -1,
      ...ctx.getStyles("control"),
      children: typeof value === "number" ? padTime(value) : value
    }
  );
}
TimeControl.displayName = "@mantine/dates/TimeControl";

export { TimeControl };
//# sourceMappingURL=TimeControl.mjs.map
