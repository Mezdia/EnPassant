'use client';
import { jsx } from 'react/jsx-runtime';
import { factory, useProps, useResolvedStylesApi } from '@mantine/core';
import 'dayjs';
import 'react';
import '@mantine/hooks';
import { getDefaultClampedDate } from '../../utils/get-default-clamped-date/get-default-clamped-date.mjs';
import { useDatesInput } from '../../hooks/use-dates-input/use-dates-input.mjs';
import '../Calendar/Calendar.mjs';
import { pickCalendarProps } from '../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.mjs';
import { DatePicker } from '../DatePicker/DatePicker.mjs';
import { PickerInputBase } from '../PickerInputBase/PickerInputBase.mjs';

const defaultProps = {
  type: "default",
  valueFormat: "MMMM D, YYYY",
  closeOnChange: true,
  sortDates: true,
  dropdownType: "popover"
};
const DatePickerInput = factory(
  (_props, ref) => {
    const props = useProps("DatePickerInput", defaultProps, _props);
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
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const { calendarProps, others } = pickCalendarProps(rest);
    const {
      _value,
      setValue,
      formattedValue,
      dropdownHandlers,
      dropdownOpened,
      onClear,
      shouldClear
    } = useDatesInput({
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
    return /* @__PURE__ */ jsx(
      PickerInputBase,
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
        children: /* @__PURE__ */ jsx(
          DatePicker,
          {
            ...calendarProps,
            size,
            variant,
            type,
            value: _value,
            defaultDate: _defaultDate || getDefaultClampedDate({ maxDate, minDate }),
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
DatePickerInput.classes = { ...PickerInputBase.classes, ...DatePicker.classes };
DatePickerInput.displayName = "@mantine/dates/DatePickerInput";

export { DatePickerInput };
//# sourceMappingURL=DatePickerInput.mjs.map
