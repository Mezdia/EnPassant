'use client';
import { jsx } from 'react/jsx-runtime';
import { createVarsResolver, getRadius, getFontSize, factory, useProps, useStyles, Box, SimpleGrid } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { isSameTime } from '../TimePicker/utils/is-same-time/is-same-time.mjs';
import { isTimeBefore, isTimeAfter } from './compare-time.mjs';
import { TimeGridProvider } from './TimeGrid.context.mjs';
import classes from './TimeGrid.module.css.mjs';
import { TimeGridControl } from './TimeGridControl.mjs';

const defaultProps = {
  simpleGridProps: { cols: 3, spacing: "xs" },
  format: "24h",
  amPmLabels: { am: "AM", pm: "PM" }
};
const varsResolver = createVarsResolver((_theme, { size, radius }) => ({
  root: {
    "--time-grid-fz": getFontSize(size),
    "--time-grid-radius": getRadius(radius)
  }
}));
const TimeGrid = factory((_props, ref) => {
  const props = useProps("TimeGrid", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    data,
    value,
    defaultValue,
    onChange,
    format,
    withSeconds = false,
    amPmLabels,
    allowDeselect,
    simpleGridProps,
    getControlProps,
    minTime,
    maxTime,
    disableTime,
    disabled,
    attributes,
    ...others
  } = props;
  const getStyles = useStyles({
    name: "TimeGrid",
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    varsResolver
  });
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  });
  const controls = data.map((time) => {
    const isDisabled = disabled || !!minTime && isTimeBefore(time, minTime) || !!maxTime && isTimeAfter(time, maxTime) || (Array.isArray(disableTime) ? !!disableTime.find((t) => isSameTime({ time, compare: t, withSeconds })) : !!disableTime?.(time));
    return /* @__PURE__ */ jsx(
      TimeGridControl,
      {
        active: isSameTime({ time, compare: _value || "", withSeconds }),
        time,
        onClick: () => {
          const nextValue = allowDeselect && (_value === null ? time === _value : isSameTime({ time, compare: _value, withSeconds })) ? null : time;
          nextValue !== _value && setValue(nextValue);
        },
        format,
        amPmLabels,
        disabled: isDisabled,
        "data-disabled": isDisabled || void 0,
        withSeconds,
        ...getControlProps?.(time)
      },
      time
    );
  });
  return /* @__PURE__ */ jsx(TimeGridProvider, { value: { getStyles }, children: /* @__PURE__ */ jsx(Box, { ref, ...getStyles("root"), ...others, children: /* @__PURE__ */ jsx(
    SimpleGrid,
    {
      ...simpleGridProps,
      ...getStyles("simpleGrid", {
        className: simpleGridProps?.className,
        style: simpleGridProps?.style
      }),
      children: controls
    }
  ) }) });
});
TimeGrid.displayName = "@mantine/dates/TimeGrid";
TimeGrid.classes = classes;

export { TimeGrid };
//# sourceMappingURL=TimeGrid.mjs.map
