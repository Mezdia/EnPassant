'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { factory, useProps, useStyles, useResolvedStylesApi, ActionIcon, CheckIcon } from '@mantine/core';
import { useMergedRef, useDisclosure, useDidUpdate } from '@mantine/hooks';
import { useUncontrolledDates } from '../../hooks/use-uncontrolled-dates/use-uncontrolled-dates.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { assignTime } from '../../utils/assign-time/assign-time.mjs';
import { getDefaultClampedDate } from '../../utils/get-default-clamped-date/get-default-clamped-date.mjs';
import { clampDate } from '../../utils/clamp-date/clamp-date.mjs';
import '../Calendar/Calendar.mjs';
import { pickCalendarProps } from '../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.mjs';
import { DatePicker } from '../DatePicker/DatePicker.mjs';
import { PickerInputBase } from '../PickerInputBase/PickerInputBase.mjs';
import { TimePicker } from '../TimePicker/TimePicker.mjs';
import classes from './DateTimePicker.module.css.mjs';
import { getMaxTime, getMinTime } from './get-min-max-time/get-min-max-time.mjs';

const defaultProps = {
  dropdownType: "popover",
  size: "sm"
};
const DateTimePicker = factory((_props, ref) => {
  const props = useProps("DateTimePicker", defaultProps, _props);
  const {
    value,
    defaultValue,
    onChange,
    valueFormat,
    locale,
    classNames,
    styles,
    unstyled,
    timePickerProps,
    submitButtonProps,
    withSeconds,
    level,
    defaultLevel,
    size,
    variant,
    dropdownType,
    vars,
    minDate,
    maxDate,
    defaultDate,
    defaultTimeValue,
    presets,
    attributes,
    onDropdownClose,
    ...rest
  } = props;
  const getStyles = useStyles({
    name: "DateTimePicker",
    classes,
    props,
    classNames,
    styles,
    unstyled,
    attributes,
    vars
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const _valueFormat = valueFormat || (withSeconds ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm");
  const timePickerRef = useRef(null);
  const timePickerRefMerged = useMergedRef(timePickerRef, timePickerProps?.hoursRef);
  const {
    calendarProps: { allowSingleDateInRange, ...calendarProps },
    others
  } = pickCalendarProps(rest);
  const ctx = useDatesContext();
  const [_value, setValue] = useUncontrolledDates({
    type: "default",
    value,
    defaultValue,
    onChange,
    withTime: true
  });
  const _defaultDate = defaultDate || _value;
  const formatTime = (dateValue) => dateValue ? dayjs(dateValue).format(withSeconds ? "HH:mm:ss" : "HH:mm") : "";
  const [timeValue, setTimeValue] = useState(defaultTimeValue || formatTime(_value));
  const [currentLevel, setCurrentLevel] = useState(level || defaultLevel || "month");
  const [dropdownOpened, dropdownHandlers] = useDisclosure(false);
  const formattedValue = _value ? dayjs(_value).locale(ctx.getLocale(locale)).format(_valueFormat) : "";
  const handleTimeChange = (timeString) => {
    timePickerProps?.onChange?.(timeString);
    setTimeValue(timeString);
    if (timeString) {
      setValue(assignTime(_value, timeString));
    }
  };
  const handleDateChange = (date) => {
    if (date) {
      setValue(assignTime(clampDate(minDate, maxDate, date), timeValue || defaultTimeValue || ""));
    }
    timePickerRef.current?.focus();
  };
  const handleTimeInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dropdownHandlers.close();
    }
  };
  useDidUpdate(() => {
    if (!dropdownOpened) {
      setTimeValue(formatTime(_value));
    }
  }, [_value, dropdownOpened]);
  useDidUpdate(() => {
    if (dropdownOpened) {
      setCurrentLevel("month");
    }
  }, [dropdownOpened]);
  const __stopPropagation = dropdownType === "popover";
  const handleDropdownClose = () => {
    const clamped = clampDate(minDate, maxDate, _value);
    if (_value && _value !== clamped) {
      setValue(clampDate(minDate, maxDate, _value));
    }
    onDropdownClose?.();
  };
  return /* @__PURE__ */ jsxs(
    PickerInputBase,
    {
      formattedValue,
      dropdownOpened: !rest.disabled ? dropdownOpened : false,
      dropdownHandlers,
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      unstyled,
      ref,
      onClear: () => setValue(null),
      shouldClear: !!_value,
      value: _value,
      size,
      variant,
      dropdownType,
      ...others,
      type: "default",
      __staticSelector: "DateTimePicker",
      onDropdownClose: handleDropdownClose,
      withTime: true,
      attributes,
      children: [
        /* @__PURE__ */ jsx(
          DatePicker,
          {
            ...calendarProps,
            maxDate,
            minDate,
            size,
            variant,
            type: "default",
            value: _value,
            defaultDate: _defaultDate || getDefaultClampedDate({ maxDate, minDate }),
            onChange: handleDateChange,
            locale,
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            unstyled,
            __staticSelector: "DateTimePicker",
            __stopPropagation,
            level,
            defaultLevel,
            onLevelChange: (_level) => {
              setCurrentLevel(_level);
              calendarProps.onLevelChange?.(_level);
            },
            presets,
            __onPresetSelect: (val) => {
              setValue(val);
              val && setTimeValue(formatTime(val));
            },
            attributes
          }
        ),
        currentLevel === "month" && /* @__PURE__ */ jsxs("div", { ...getStyles("timeWrapper"), children: [
          /* @__PURE__ */ jsx(
            TimePicker,
            {
              value: timeValue,
              withSeconds,
              unstyled,
              min: getMinTime({ minDate, value: _value }),
              max: getMaxTime({ maxDate, value: _value }),
              ...timePickerProps,
              ...getStyles("timeInput", {
                className: timePickerProps?.className,
                style: timePickerProps?.style
              }),
              onChange: handleTimeChange,
              onKeyDown: handleTimeInputKeyDown,
              size,
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              hoursRef: timePickerRefMerged,
              attributes
            }
          ),
          /* @__PURE__ */ jsx(
            ActionIcon,
            {
              variant: "default",
              size: `input-${size || "sm"}`,
              ...getStyles("submitButton", {
                className: submitButtonProps?.className,
                style: submitButtonProps?.style
              }),
              unstyled,
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              children: /* @__PURE__ */ jsx(CheckIcon, { size: "30%" }),
              ...submitButtonProps,
              onClick: (event) => {
                submitButtonProps?.onClick?.(event);
                dropdownHandlers.close();
                handleDropdownClose();
              }
            }
          )
        ] })
      ]
    }
  );
});
DateTimePicker.classes = { ...classes, ...PickerInputBase.classes, ...DatePicker.classes };
DateTimePicker.displayName = "@mantine/dates/DateTimePicker";

export { DateTimePicker };
//# sourceMappingURL=DateTimePicker.mjs.map
