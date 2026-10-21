'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var react = require('react');
var core = require('@mantine/core');
var useDatesState = require('../../hooks/use-dates-state/use-dates-state.cjs');
require('@mantine/hooks');
require('../DatesProvider/DatesProvider.cjs');
var Calendar = require('../Calendar/Calendar.cjs');
var pickCalendarLevelsProps = require('../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.cjs');
var isSameMonth = require('../Month/is-same-month/is-same-month.cjs');
require('../Month/Month.cjs');
var DatePicker_module = require('./DatePicker.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const varsResolver = core.createVarsResolver((_, { size }) => ({
  datePickerRoot: {
    "--preset-font-size": core.getFontSize(size)
  }
}));
const defaultProps = {
  type: "default",
  defaultLevel: "month",
  numberOfColumns: 1,
  size: "sm"
};
const DatePicker = core.factory((_props, ref) => {
  const props = core.useProps("DatePicker", defaultProps, _props);
  const {
    allowDeselect,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange,
    onMouseLeave,
    classNames,
    styles,
    __staticSelector,
    __onDayClick,
    __onDayMouseEnter,
    __onPresetSelect,
    __stopPropagation,
    presets,
    className,
    style,
    unstyled,
    size,
    vars,
    attributes,
    ...rest
  } = props;
  const { calendarProps, others } = pickCalendarLevelsProps.pickCalendarProps(rest);
  const setDateRef = react.useRef(null);
  const setLevelRef = react.useRef(null);
  const getStyles = core.useStyles({
    name: __staticSelector || "DatePicker",
    classes: DatePicker_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    rootSelector: presets ? "datePickerRoot" : void 0,
    varsResolver,
    vars
  });
  const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps, _value, setValue } = useDatesState.useDatesState({
    type: others.type,
    level: "day",
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
  const calendar = /* @__PURE__ */ jsxRuntime.jsx(
    Calendar.Calendar,
    {
      ref,
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      __staticSelector: __staticSelector || "DatePicker",
      onMouseLeave: onRootMouseLeave,
      size,
      ...calendarProps,
      ...!presets ? others : {},
      __stopPropagation,
      __setDateRef: setDateRef,
      __setLevelRef: setLevelRef,
      minLevel: calendarProps.minLevel || "month",
      __onDayMouseEnter: (_event, date) => {
        onHoveredDateChange(date);
        __onDayMouseEnter?.(_event, date);
      },
      __onDayClick: (_event, date) => {
        onDateChange(date);
        __onDayClick?.(_event, date);
      },
      getDayProps: (date) => ({
        ...getControlProps(date),
        ...calendarProps.getDayProps?.(date)
      }),
      getMonthControlProps: (date) => ({
        selected: typeof _value === "string" ? isSameMonth.isSameMonth(date, _value) : false,
        ...calendarProps.getMonthControlProps?.(date)
      }),
      getYearControlProps: (date) => ({
        selected: typeof _value === "string" ? dayjs__default.default(date).isSame(_value, "year") : false,
        ...calendarProps.getYearControlProps?.(date)
      }),
      hideOutsideDates: calendarProps.hideOutsideDates ?? calendarProps.numberOfColumns !== 1,
      ...!presets ? { className, style, attributes } : {}
    }
  );
  if (!presets) {
    return calendar;
  }
  const handlePresetSelect = (val) => {
    const _val = Array.isArray(val) ? val[0] : val;
    if (_val !== void 0) {
      setDateRef.current?.(_val);
      setLevelRef.current?.("month");
      __onPresetSelect ? __onPresetSelect(_val) : setValue(val);
    }
  };
  const presetButtons = presets.map((preset, index) => /* @__PURE__ */ jsxRuntime.jsx(
    core.UnstyledButton,
    {
      ...getStyles("presetButton"),
      onClick: () => handlePresetSelect(preset.value),
      onMouseDown: (event) => event.preventDefault(),
      "data-mantine-stop-propagation": __stopPropagation || void 0,
      children: preset.label
    },
    index
  ));
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { ...getStyles("datePickerRoot"), size, ...others, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { ...getStyles("presetsList"), children: presetButtons }),
    calendar
  ] });
});
DatePicker.classes = Calendar.Calendar.classes;
DatePicker.displayName = "@mantine/dates/DatePicker";

exports.DatePicker = DatePicker;
//# sourceMappingURL=DatePicker.cjs.map
