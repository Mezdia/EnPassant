'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
require('dayjs');
require('react');
require('@mantine/hooks');
var getDefaultClampedDate = require('../../utils/get-default-clamped-date/get-default-clamped-date.cjs');
var useDatesInput = require('../../hooks/use-dates-input/use-dates-input.cjs');
require('../Calendar/Calendar.cjs');
var pickCalendarLevelsProps = require('../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.cjs');
var DatePicker = require('../DatePicker/DatePicker.cjs');
var PickerInputBase = require('../PickerInputBase/PickerInputBase.cjs');

const defaultProps = {
  type: "default",
  valueFormat: "MMMM D, YYYY",
  closeOnChange: true,
  sortDates: true,
  dropdownType: "popover"
};
const DatePickerInput = core.factory(
  (_props, ref) => {
    const props = core.useProps("DatePickerInput", defaultProps, _props);
    const {
      type,
      value,
      defaultValue,
      onChange,
      valueFormat,
      labelSeparator,
      locale,
      classNames,
      styles,
      unstyled,
      closeOnChange,
      size,
      variant,
      dropdownType,
      sortDates,
      minDate,
      maxDate,
      vars,
      defaultDate,
      valueFormatter,
      presets,
      attributes,
      ...rest
    } = props;
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const { calendarProps, others } = pickCalendarLevelsProps.pickCalendarProps(rest);
    const {
      _value,
      setValue,
      formattedValue,
      dropdownHandlers,
      dropdownOpened,
      onClear,
      shouldClear
    } = useDatesInput.useDatesInput({
      type,
      value,
      defaultValue,
      onChange,
      locale,
      format: valueFormat,
      labelSeparator,
      closeOnChange,
      sortDates,
      valueFormatter
    });
    const _defaultDate = Array.isArray(_value) ? _value[0] || defaultDate : _value || defaultDate;
    return /* @__PURE__ */ jsxRuntime.jsx(
      PickerInputBase.PickerInputBase,
      {
        formattedValue,
        dropdownOpened,
        dropdownHandlers,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        unstyled,
        ref,
        onClear,
        shouldClear,
        value: _value,
        size,
        variant,
        dropdownType,
        ...others,
        type,
        __staticSelector: "DatePickerInput",
        attributes,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          DatePicker.DatePicker,
          {
            ...calendarProps,
            size,
            variant,
            type,
            value: _value,
            defaultDate: _defaultDate || getDefaultClampedDate.getDefaultClampedDate({ maxDate, minDate }),
            onChange: setValue,
            locale,
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            unstyled,
            __staticSelector: "DatePickerInput",
            __stopPropagation: dropdownType === "popover",
            minDate,
            maxDate,
            presets,
            attributes
          }
        )
      }
    );
  }
);
DatePickerInput.classes = { ...PickerInputBase.PickerInputBase.classes, ...DatePicker.DatePicker.classes };
DatePickerInput.displayName = "@mantine/dates/DatePickerInput";

exports.DatePickerInput = DatePickerInput;
//# sourceMappingURL=DatePickerInput.cjs.map
