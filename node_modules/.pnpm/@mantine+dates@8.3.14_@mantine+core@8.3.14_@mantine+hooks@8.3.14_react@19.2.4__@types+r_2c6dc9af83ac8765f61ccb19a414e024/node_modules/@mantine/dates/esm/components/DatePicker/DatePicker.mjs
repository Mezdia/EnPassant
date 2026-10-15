'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { createVarsResolver, getFontSize, factory, useProps, useStyles, useResolvedStylesApi, UnstyledButton, Box } from '@mantine/core';
import { useDatesState } from '../../hooks/use-dates-state/use-dates-state.mjs';
import '@mantine/hooks';
import '../DatesProvider/DatesProvider.mjs';
import { Calendar } from '../Calendar/Calendar.mjs';
import { pickCalendarProps } from '../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.mjs';
import { isSameMonth } from '../Month/is-same-month/is-same-month.mjs';
import '../Month/Month.mjs';
import classes from './DatePicker.module.css.mjs';

const varsResolver = createVarsResolver((_, { size }) => ({
  datePickerRoot: {
    "--preset-font-size": getFontSize(size)
  }
}));
const defaultProps = {
  type: "default",
  defaultLevel: "month",
  numberOfColumns: 1,
  size: "sm"
};
const DatePicker = factory((_props, ref) => {
  const props = useProps("DatePicker", defaultProps, _props);
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
  const { calendarProps, others } = pickCalendarProps(rest);
  const setDateRef = useRef(null);
  const setLevelRef = useRef(null);
  const getStyles = useStyles({
    name: __staticSelector || "DatePicker",
    classes,
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
  const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps, _value, setValue } = useDatesState({
    type: others.type,
    level: "day",
    allowDeselect,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange,
    onMouseLeave
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const calendar = /* @__PURE__ */ jsx(
    Calendar,
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
        selected: typeof _value === "string" ? isSameMonth(date, _value) : false,
        ...calendarProps.getMonthControlProps?.(date)
      }),
      getYearControlProps: (date) => ({
        selected: typeof _value === "string" ? dayjs(date).isSame(_value, "year") : false,
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
  const presetButtons = presets.map((preset, index) => /* @__PURE__ */ jsx(
    UnstyledButton,
    {
      ...getStyles("presetButton"),
      onClick: () => handlePresetSelect(preset.value),
      onMouseDown: (event) => event.preventDefault(),
      "data-mantine-stop-propagation": __stopPropagation || void 0,
      children: preset.label
    },
    index
  ));
  return /* @__PURE__ */ jsxs(Box, { ...getStyles("datePickerRoot"), size, ...others, children: [
    /* @__PURE__ */ jsx("div", { ...getStyles("presetsList"), children: presetButtons }),
    calendar
  ] });
});
DatePicker.classes = Calendar.classes;
DatePicker.displayName = "@mantine/dates/DatePicker";

export { DatePicker };
//# sourceMappingURL=DatePicker.mjs.map
