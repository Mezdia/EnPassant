'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var useDatesState = require('../../hooks/use-dates-state/use-dates-state.cjs');
require('dayjs');
require('@mantine/hooks');
require('../DatesProvider/DatesProvider.cjs');
require('react');
var Calendar = require('../Calendar/Calendar.cjs');

const defaultProps = {
  type: "default"
};
const MonthPicker = core.factory((_props, ref) => {
  const props = core.useProps("MonthPicker", defaultProps, _props);
  const {
    classNames,
    styles,
    vars,
    type,
    defaultValue,
    value,
    onChange,
    __staticSelector,
    getMonthControlProps,
    allowSingleDateInRange,
    allowDeselect,
    onMouseLeave,
    onMonthSelect,
    __updateDateOnMonthSelect,
    onLevelChange,
    ...others
  } = props;
  const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState.useDatesState({
    type,
    level: "month",
    allowDeselect,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange,
    onMouseLeave
  });
  const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  return /* @__PURE__ */ jsxRuntime.jsx(
    Calendar.Calendar,
    {
      ref,
      minLevel: "year",
      __updateDateOnMonthSelect: __updateDateOnMonthSelect ?? false,
      __staticSelector: __staticSelector || "MonthPicker",
      onMouseLeave: onRootMouseLeave,
      onMonthMouseEnter: (_event, date) => onHoveredDateChange(date),
      onMonthSelect: (date) => {
        onDateChange(date);
        onMonthSelect?.(date);
      },
      getMonthControlProps: (date) => ({
        ...getControlProps(date),
        ...getMonthControlProps?.(date)
      }),
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      onLevelChange,
      ...others
    }
  );
});
MonthPicker.classes = Calendar.Calendar.classes;
MonthPicker.displayName = "@mantine/dates/MonthPicker";

exports.MonthPicker = MonthPicker;
//# sourceMappingURL=MonthPicker.cjs.map
