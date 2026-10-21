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
import { PickerInputBase } from '../PickerInputBase/PickerInputBase.mjs';
import { YearPicker } from '../YearPicker/YearPicker.mjs';

const defaultProps = {
  type: "default",
  valueFormat: "YYYY",
  closeOnChange: true,
  sortDates: true,
  dropdownType: "popover"
};
const YearPickerInput = factory(
  (_props, ref) => {
    const props = useProps("YearPickerInput", defaultProps, _props);
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
        __staticSelector: "YearPickerInput",
        attributes,
        children: /* @__PURE__ */ jsx(
          YearPicker,
          {
            ...calendarProps,
            size,
            variant,
            type,
            value: _value,
            defaultDate: calendarProps.defaultDate || (Array.isArray(_value) ? _value[0] || getDefaultClampedDate({ maxDate, minDate }) : _value || getDefaultClampedDate({ maxDate, minDate })),
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
YearPickerInput.classes = { ...PickerInputBase.classes, ...YearPicker.classes };
YearPickerInput.displayName = "@mantine/dates/YearPickerInput";

export { YearPickerInput };
//# sourceMappingURL=YearPickerInput.mjs.map
