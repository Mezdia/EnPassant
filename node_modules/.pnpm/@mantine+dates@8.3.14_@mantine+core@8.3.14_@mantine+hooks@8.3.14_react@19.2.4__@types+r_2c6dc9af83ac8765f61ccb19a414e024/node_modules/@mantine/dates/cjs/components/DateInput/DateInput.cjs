'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var react = require('react');
var core = require('@mantine/core');
var hooks = require('@mantine/hooks');
var useUncontrolledDates = require('../../hooks/use-uncontrolled-dates/use-uncontrolled-dates.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var Calendar = require('../Calendar/Calendar.cjs');
var pickCalendarLevelsProps = require('../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.cjs');
var HiddenDatesInput = require('../HiddenDatesInput/HiddenDatesInput.cjs');
var isSameMonth = require('../Month/is-same-month/is-same-month.cjs');
require('../Month/Month.cjs');
var dateStringParser = require('./date-string-parser/date-string-parser.cjs');
var isDateValid = require('./is-date-valid/is-date-valid.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  valueFormat: "MMMM D, YYYY",
  fixOnBlur: true,
  size: "sm"
};
const DateInput = core.factory((_props, ref) => {
  const props = core.useInputProps("DateInput", defaultProps, _props);
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
  const _wrapperRef = react.useRef(null);
  const _dropdownRef = react.useRef(null);
  const [dropdownOpened, setDropdownOpened] = react.useState(false);
  const { calendarProps, others } = pickCalendarLevelsProps.pickCalendarProps(rest);
  const ctx = useDatesContext.useDatesContext();
  const defaultDateParser = (val) => {
    const parsedDate = dayjs__default.default(val, valueFormat, ctx.getLocale(locale)).toDate();
    return Number.isNaN(parsedDate.getTime()) ? dateStringParser.dateStringParser(val) : dayjs__default.default(parsedDate).format("YYYY-MM-DD");
  };
  const _dateParser = dateParser || defaultDateParser;
  const _allowDeselect = allowDeselect !== void 0 ? allowDeselect : clearable;
  const formatValue = (val) => val ? dayjs__default.default(val).locale(ctx.getLocale(locale)).format(valueFormat) : "";
  const [_value, setValue, controlled] = useUncontrolledDates.useUncontrolledDates({
    type: "default",
    value,
    defaultValue,
    onChange
  });
  const [_date, setDate] = useUncontrolledDates.useUncontrolledDates({
    type: "default",
    value: date,
    defaultValue: defaultValue || defaultDate,
    onChange: onDateChange
  });
  react.useEffect(() => {
    if (controlled && value !== null) {
      setDate(value);
    }
  }, [controlled, value]);
  const [inputValue, setInputValue] = react.useState(formatValue(_value));
  react.useEffect(() => {
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
      if (dateValue && isDateValid.isDateValid({ date: dateValue, minDate, maxDate })) {
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
    selected: dayjs__default.default(_value).isSame(day, "day"),
    onClick: (event) => {
      getDayProps?.(day).onClick?.(event);
      const val = _allowDeselect ? dayjs__default.default(_value).isSame(day, "day") ? null : day : day;
      setValue(val);
      !controlled && val && setInputValue(formatValue(val));
      setDropdownOpened(false);
    }
  });
  const clearButton = /* @__PURE__ */ jsxRuntime.jsx(
    core.Input.ClearButton,
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
  hooks.useDidUpdate(() => {
    _value !== void 0 && !dropdownOpened && setInputValue(formatValue(_value));
  }, [_value]);
  hooks.useClickOutside(() => setDropdownOpened(false), void 0, [
    _wrapperRef.current,
    _dropdownRef.current
  ]);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(core.Input.Wrapper, { ...wrapperProps, __staticSelector: "DateInput", ref: _wrapperRef, children: /* @__PURE__ */ jsxRuntime.jsxs(
      core.Popover,
      {
        opened: dropdownOpened,
        trapFocus: false,
        position: "bottom-start",
        disabled: readOnly || disabled,
        withRoles: false,
        unstyled,
        ...popoverProps,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Target, { children: /* @__PURE__ */ jsxRuntime.jsx(
            core.Input,
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
          /* @__PURE__ */ jsxRuntime.jsx(
            core.Popover.Dropdown,
            {
              onMouseDown: (event) => event.preventDefault(),
              "data-dates-dropdown": true,
              ref: _dropdownRef,
              children: /* @__PURE__ */ jsxRuntime.jsx(
                Calendar.Calendar,
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
                    selected: typeof _value === "string" ? isSameMonth.isSameMonth(date2, _value) : false,
                    ...getMonthControlProps?.(date2)
                  }),
                  getYearControlProps: (date2) => ({
                    selected: typeof _value === "string" ? dayjs__default.default(date2).isSame(_value, "year") : false,
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
    /* @__PURE__ */ jsxRuntime.jsx(HiddenDatesInput.HiddenDatesInput, { name, form, value: _value, type: "default" })
  ] });
});
DateInput.classes = { ...core.Input.classes, ...Calendar.Calendar.classes };
DateInput.displayName = "@mantine/dates/DateInput";

exports.DateInput = DateInput;
//# sourceMappingURL=DateInput.cjs.map
