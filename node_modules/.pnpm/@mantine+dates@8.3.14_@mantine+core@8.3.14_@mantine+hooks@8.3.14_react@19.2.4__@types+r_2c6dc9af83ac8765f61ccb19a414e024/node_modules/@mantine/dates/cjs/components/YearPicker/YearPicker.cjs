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
const YearPicker = core.factory((_props, ref) => {
  const props = core.useProps("YearPicker", defaultProps, _props);
  const {
    classNames,
    styles,
    vars,
    type,
    defaultValue,
    value,
    onChange,
    __staticSelector,
    getYearControlProps,
    allowSingleDateInRange,
    allowDeselect,
    onMouseLeave,
    onYearSelect,
    __updateDateOnYearSelect,
    ...others
  } = props;
  const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState.useDatesState({
    type,
    level: "year",
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
      minLevel: "decade",
      __updateDateOnYearSelect: __updateDateOnYearSelect ?? false,
      __staticSelector: __staticSelector || "YearPicker",
      onMouseLeave: onRootMouseLeave,
      onYearMouseEnter: (_event, date) => onHoveredDateChange(date),
      onYearSelect: (date) => {
        onDateChange(date);
        onYearSelect?.(date);
      },
      getYearControlProps: (date) => ({
        ...getControlProps(date),
        ...getYearControlProps?.(date)
      }),
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      ...others
    }
  );
});
YearPicker.classes = Calendar.Calendar.classes;
YearPicker.displayName = "@mantine/dates/YearPicker";

exports.YearPicker = YearPicker;
//# sourceMappingURL=YearPicker.cjs.map
