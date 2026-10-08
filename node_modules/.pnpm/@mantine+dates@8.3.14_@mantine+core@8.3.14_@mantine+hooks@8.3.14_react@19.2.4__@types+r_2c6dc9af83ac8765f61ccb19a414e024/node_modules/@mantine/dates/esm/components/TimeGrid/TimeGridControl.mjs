'use client';
import { jsx } from 'react/jsx-runtime';
import cx from 'clsx';
import { useMantineTheme, UnstyledButton } from '@mantine/core';
import { TimeValue } from '../TimeValue/TimeValue.mjs';
import { useTimeGridContext } from './TimeGrid.context.mjs';

function TimeGridControl({
  time,
  active,
  className,
  amPmLabels,
  format,
  withSeconds,
  ...others
}) {
  const ctx = useTimeGridContext();
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(
    UnstyledButton,
    {
      mod: [{ active }],
      ...ctx.getStyles("control", { className: cx(theme.activeClassName, className) }),
      ...others,
      children: /* @__PURE__ */ jsx(TimeValue, { value: time, format, amPmLabels, withSeconds })
    }
  );
}

export { TimeGridControl };
//# sourceMappingURL=TimeGridControl.mjs.map
