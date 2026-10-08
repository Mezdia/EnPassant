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
var PickerInputBase = require('../PickerInputBase/PickerInputBase.cjs');
var YearPicker = require('../YearPicker/YearPicker.cjs');

const defaultProps = {
  type: "default",
  valueFormat: "YYYY",
  closeOnChange: true,
  sortDates: true,
  dropdownType: "popover"
};
const YearPickerInput = core.factory(
  (_props, ref) => {
    const props = core.useProps("YearPickerInput", defaultProps, _props);
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
      valueFormatter,
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
        __staticSelector: "YearPickerInput",
        attributes,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          YearPicker.YearPicker,
          {
            ...calendarProps,
            size,
            variant,
            type,
            value: _value,
            defaultDate: calendarProps.defaultDate || (Array.isArray(_value) ? _value[0] || getDefaultClampedDate.getDefaultClampedDate({ maxDate, minDate }) : _value || getDefaultClampedDate.getDefaultClampedDate({ maxDate, minDate })),
            onChange: setValue,
            locale,
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            unstyled,
            __staticSelector: "YearPickerInput",
            __stopPropagation: dropdownType === "popover",
            minDate,
            maxDate,
            attributes
          }
        )
      }
    );
  }
);
YearPickerInput.classes = { ...PickerInputBase.PickerInputBase.classes, ...YearPicker.YearPicker.classes };
YearPickerInput.displayName = "@mantine/dates/YearPickerInput";

exports.YearPickerInput = YearPickerInput;
//# sourceMappingURL=YearPickerInput.cjs.map
