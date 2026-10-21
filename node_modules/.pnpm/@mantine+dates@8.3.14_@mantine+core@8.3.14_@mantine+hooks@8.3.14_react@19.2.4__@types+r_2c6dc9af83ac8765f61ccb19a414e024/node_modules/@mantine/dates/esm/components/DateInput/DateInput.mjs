'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useRef, useState, useEffect } from 'react';
import { factory, useInputProps, Input, Popover } from '@mantine/core';
import { useDidUpdate, useClickOutside } from '@mantine/hooks';
import { useUncontrolledDates } from '../../hooks/use-uncontrolled-dates/use-uncontrolled-dates.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { Calendar } from '../Calendar/Calendar.mjs';
import { pickCalendarProps } from '../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.mjs';
import { HiddenDatesInput } from '../HiddenDatesInput/HiddenDatesInput.mjs';
import { isSameMonth } from '../Month/is-same-month/is-same-month.mjs';
import '../Month/Month.mjs';
import { dateStringParser } from './date-string-parser/date-string-parser.mjs';
import { isDateValid } from './is-date-valid/is-date-valid.mjs';

const defaultProps = {
  valueFormat: "MMMM D, YYYY",
  fixOnBlur: true,
  size: "sm"
};
const DateInput = factory((_props, ref) => {
  const props = useInputProps("DateInput", defaultProps, _props);
  const {
    inputProps,
    wrapperProps,
    value,
    defaultValue,
    onChange,
    clearable,
    clearButtonProps,
    popoverProps,
    getDayProps,
    locale,
    valueFormat,
    dateParser,
    minDate,
    maxDate,
    fixOnBlur,
    onFocus,
    onBlur,
    onClick,
    onKeyDown,
    readOnly,
    name,
    form,
    rightSection,
    unstyled,
    classNames,
    styles,
    allowDeselect,
    date,
    defaultDate,
    onDateChange,
    getMonthControlProps,
    getYearControlProps,
    disabled,
    ...rest
  } = props;
  const _wrapperRef = useRef(null);
  const _dropdownRef = useRef(null);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const { calendarProps, others } = pickCalendarProps(rest);
  const ctx = useDatesContext();
  const defaultDateParser = (val) => {
    const parsedDate = dayjs(val, valueFormat, ctx.getLocale(locale)).toDate();
    return Number.isNaN(parsedDate.getTime()) ? dateStringParser(val) : dayjs(parsedDate).format("YYYY-MM-DD");
  };
  const _dateParser = dateParser || defaultDateParser;
  const _allowDeselect = allowDeselect !== void 0 ? allowDeselect : clearable;
  const formatValue = (val) => val ? dayjs(val).locale(ctx.getLocale(locale)).format(valueFormat) : "";
  const [_value, setValue, controlled] = useUncontrolledDates({
    type: "default",
    value,
    defaultValue,
    onChange
  });
  const [_date, setDate] = useUncontrolledDates({
    type: "default",
    value: date,
    defaultValue: defaultValue || defaultDate,
    onChange: onDateChange
  });
  useEffect(() => {
    if (controlled && value !== null) {
      setDate(value);
    }
  }, [controlled, value]);
  const [inputValue, setInputValue] = useState(formatValue(_value));
  useEffect(() => {
    setInputValue(formatValue(_value));
  }, [ctx.getLocale(locale)]);
  const handleInputChange = (event) => {
    const val = event.currentTarget.value;
    setInputValue(val);
    setDropdownOpened(true);
    if (val.trim() === "" && (allowDeselect || clearable)) {
      setValue(null);
    } else {
      const dateValue = _dateParser(val);
      if (dateValue && isDateValid({ date: dateValue, minDate, maxDate })) {
        setValue(dateValue);
        setDate(dateValue);
      }
    }
  };
  const handleInputBlur = (event) => {
    onBlur?.(event);
    setDropdownOpened(false);
    fixOnBlur && setInputValue(formatValue(_value));
  };
  const handleInputFocus = (event) => {
    onFocus?.(event);
    setDropdownOpened(true);
  };
  const handleInputClick = (event) => {
    onClick?.(event);
    setDropdownOpened(true);
  };
  const handleInputKeyDown = (event) => {
    if (event.key === "Escape") {
      setDropdownOpened(false);
    }
    onKeyDown?.(event);
  };
  const _getDayProps = (day) => ({
    ...getDayProps?.(day),
    selected: dayjs(_value).isSame(day, "day"),
    onClick: (event) => {
      getDayProps?.(day).onClick?.(event);
      const val = _allowDeselect ? dayjs(_value).isSame(day, "day") ? null : day : day;
      setValue(val);
      !controlled && val && setInputValue(formatValue(val));
      setDropdownOpened(false);
    }
  });
  const clearButton = /* @__PURE__ */ jsx(
    Input.ClearButton,
    {
      onClick: () => {
        setValue(null);
        !controlled && setInputValue("");
        setDropdownOpened(false);
      },
      unstyled,
      ...clearButtonProps
    }
  );
  const _clearable = clearable && !!_value && !readOnly && !disabled;
  useDidUpdate(() => {
    _value !== void 0 && !dropdownOpened && setInputValue(formatValue(_value));
  }, [_value]);
  useClickOutside(() => setDropdownOpened(false), void 0, [
    _wrapperRef.current,
    _dropdownRef.current
  ]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Input.Wrapper, { ...wrapperProps, __staticSelector: "DateInput", ref: _wrapperRef, children: /* @__PURE__ */ jsxs(
      Popover,
      {
        opened: dropdownOpened,
        trapFocus: false,
        position: "bottom-start",
        disabled: readOnly || disabled,
        withRoles: false,
        unstyled,
        ...popoverProps,
        children: [
          /* @__PURE__ */ jsx(Popover.Target, { children: /* @__PURE__ */ jsx(
            Input,
            {
              "data-dates-input": true,
              "data-read-only": readOnly || void 0,
              autoComplete: "off",
              ref,
              value: inputValue,
              onChange: handleInputChange,
              onBlur: handleInputBlur,
              onFocus: handleInputFocus,
              onClick: handleInputClick,
              onKeyDown: handleInputKeyDown,
              readOnly,
              rightSection,
              __clearSection: clearButton,
              __clearable: _clearable,
              ...inputProps,
              ...others,
              disabled,
              __staticSelector: "DateInput"
            }
          ) }),
          /* @__PURE__ */ jsx(
            Popover.Dropdown,
            {
              onMouseDown: (event) => event.preventDefault(),
              "data-dates-dropdown": true,
              ref: _dropdownRef,
              children: /* @__PURE__ */ jsx(
                Calendar,
                {
                  __staticSelector: "DateInput",
                  ...calendarProps,
                  classNames,
                  styles,
                  unstyled,
                  __preventFocus: true,
                  minDate,
                  maxDate,
                  locale,
                  getDayProps: _getDayProps,
                  size: inputProps.size,
                  date: _date,
                  onDateChange: setDate,
                  getMonthControlProps: (date2) => ({
                    selected: typeof _value === "string" ? isSameMonth(date2, _value) : false,
                    ...getMonthControlProps?.(date2)
                  }),
                  getYearControlProps: (date2) => ({
                    selected: typeof _value === "string" ? dayjs(date2).isSame(_value, "year") : false,
                    ...getYearControlProps?.(date2)
                  }),
                  attributes: wrapperProps.attributes
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(HiddenDatesInput, { name, form, value: _value, type: "default" })
  ] });
});
DateInput.classes = { ...Input.classes, ...Calendar.classes };
DateInput.displayName = "@mantine/dates/DateInput";

export { DateInput };
//# sourceMappingURL=DateInput.mjs.map
