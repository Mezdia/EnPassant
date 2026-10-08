'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var hooks = require('@mantine/hooks');
var isSameTime = require('../TimePicker/utils/is-same-time/is-same-time.cjs');
var compareTime = require('./compare-time.cjs');
var TimeGrid_context = require('./TimeGrid.context.cjs');
var TimeGrid_module = require('./TimeGrid.module.css.cjs');
var TimeGridControl = require('./TimeGridControl.cjs');

const defaultProps = {
  simpleGridProps: { cols: 3, spacing: "xs" },
  format: "24h",
  amPmLabels: { am: "AM", pm: "PM" }
};
const varsResolver = core.createVarsResolver((_theme, { size, radius }) => ({
  root: {
    "--time-grid-fz": core.getFontSize(size),
    "--time-grid-radius": core.getRadius(radius)
  }
}));
const TimeGrid = core.factory((_props, ref) => {
  const props = core.useProps("TimeGrid", defaultProps, _props);
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
  const getStyles = core.useStyles({
    name: "TimeGrid",
    classes: TimeGrid_module,
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
  const [_value, setValue] = hooks.useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  });
  const controls = data.map((time) => {
    const isDisabled = disabled || !!minTime && compareTime.isTimeBefore(time, minTime) || !!maxTime && compareTime.isTimeAfter(time, maxTime) || (Array.isArray(disableTime) ? !!disableTime.find((t) => isSameTime.isSameTime({ time, compare: t, withSeconds })) : !!disableTime?.(time));
    return /* @__PURE__ */ jsxRuntime.jsx(
      TimeGridControl.TimeGridControl,
      {
        active: isSameTime.isSameTime({ time, compare: _value || "", withSeconds }),
        time,
        onClick: () => {
          const nextValue = allowDeselect && (_value === null ? time === _value : isSameTime.isSameTime({ time, compare: _value, withSeconds })) ? null : time;
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
  return /* @__PURE__ */ jsxRuntime.jsx(TimeGrid_context.TimeGridProvider, { value: { getStyles }, children: /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ref, ...getStyles("root"), ...others, children: /* @__PURE__ */ jsxRuntime.jsx(
    core.SimpleGrid,
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
TimeGrid.classes = TimeGrid_module;

exports.TimeGrid = TimeGrid;
//# sourceMappingURL=TimeGrid.cjs.map
