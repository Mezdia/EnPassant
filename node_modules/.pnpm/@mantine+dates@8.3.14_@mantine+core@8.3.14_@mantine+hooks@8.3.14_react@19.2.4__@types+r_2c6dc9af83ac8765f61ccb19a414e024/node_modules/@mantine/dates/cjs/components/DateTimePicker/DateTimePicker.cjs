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
var assignTime = require('../../utils/assign-time/assign-time.cjs');
var getDefaultClampedDate = require('../../utils/get-default-clamped-date/get-default-clamped-date.cjs');
var clampDate = require('../../utils/clamp-date/clamp-date.cjs');
require('../Calendar/Calendar.cjs');
var pickCalendarLevelsProps = require('../Calendar/pick-calendar-levels-props/pick-calendar-levels-props.cjs');
var DatePicker = require('../DatePicker/DatePicker.cjs');
var PickerInputBase = require('../PickerInputBase/PickerInputBase.cjs');
var TimePicker = require('../TimePicker/TimePicker.cjs');
var DateTimePicker_module = require('./DateTimePicker.module.css.cjs');
var getMinMaxTime = require('./get-min-max-time/get-min-max-time.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  dropdownType: "popover",
  size: "sm"
};
const DateTimePicker = core.factory((_props, ref) => {
  const props = core.useProps("DateTimePicker", defaultProps, _props);
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
  const getStyles = core.useStyles({
    name: "DateTimePicker",
    classes: DateTimePicker_module,
    props,
    classNames,
    styles,
    unstyled,
    attributes,
    vars
  });
  const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const _valueFormat = valueFormat || (withSeconds ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm");
  const timePickerRef = react.useRef(null);
  const timePickerRefMerged = hooks.useMergedRef(timePickerRef, timePickerProps?.hoursRef);
  const {
    calendarProps: { allowSingleDateInRange, ...calendarProps },
    others
  } = pickCalendarLevelsProps.pickCalendarProps(rest);
  const ctx = useDatesContext.useDatesContext();
  const [_value, setValue] = useUncontrolledDates.useUncontrolledDates({
    type: "default",
    value,
    defaultValue,
    onChange,
    withTime: true
  });
  const _defaultDate = defaultDate || _value;
  const formatTime = (dateValue) => dateValue ? dayjs__default.default(dateValue).format(withSeconds ? "HH:mm:ss" : "HH:mm") : "";
  const [timeValue, setTimeValue] = react.useState(defaultTimeValue || formatTime(_value));
  const [currentLevel, setCurrentLevel] = react.useState(level || defaultLevel || "month");
  const [dropdownOpened, dropdownHandlers] = hooks.useDisclosure(false);
  const formattedValue = _value ? dayjs__default.default(_value).locale(ctx.getLocale(locale)).format(_valueFormat) : "";
  const handleTimeChange = (timeString) => {
    timePickerProps?.onChange?.(timeString);
    setTimeValue(timeString);
    if (timeString) {
      setValue(assignTime.assignTime(_value, timeString));
    }
  };
  const handleDateChange = (date) => {
    if (date) {
      setValue(assignTime.assignTime(clampDate.clampDate(minDate, maxDate, date), timeValue || defaultTimeValue || ""));
    }
    timePickerRef.current?.focus();
  };
  const handleTimeInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dropdownHandlers.close();
    }
  };
  hooks.useDidUpdate(() => {
    if (!dropdownOpened) {
      setTimeValue(formatTime(_value));
    }
  }, [_value, dropdownOpened]);
  hooks.useDidUpdate(() => {
    if (dropdownOpened) {
      setCurrentLevel("month");
    }
  }, [dropdownOpened]);
  const __stopPropagation = dropdownType === "popover";
  const handleDropdownClose = () => {
    const clamped = clampDate.clampDate(minDate, maxDate, _value);
    if (_value && _value !== clamped) {
      setValue(clampDate.clampDate(minDate, maxDate, _value));
    }
    onDropdownClose?.();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    PickerInputBase.PickerInputBase,
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
        /* @__PURE__ */ jsxRuntime.jsx(
          DatePicker.DatePicker,
          {
            ...calendarProps,
            maxDate,
            minDate,
            size,
            variant,
            type: "default",
            value: _value,
            defaultDate: _defaultDate || getDefaultClampedDate.getDefaultClampedDate({ maxDate, minDate }),
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
        currentLevel === "month" && /* @__PURE__ */ jsxRuntime.jsxs("div", { ...getStyles("timeWrapper"), children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            TimePicker.TimePicker,
            {
              value: timeValue,
              withSeconds,
              unstyled,
              min: getMinMaxTime.getMinTime({ minDate, value: _value }),
              max: getMinMaxTime.getMaxTime({ maxDate, value: _value }),
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
          /* @__PURE__ */ jsxRuntime.jsx(
            core.ActionIcon,
            {
              variant: "default",
              size: `input-${size || "sm"}`,
              ...getStyles("submitButton", {
                className: submitButtonProps?.className,
                style: submitButtonProps?.style
              }),
              unstyled,
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              children: /* @__PURE__ */ jsxRuntime.jsx(core.CheckIcon, { size: "30%" }),
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
DateTimePicker.classes = { ...DateTimePicker_module, ...PickerInputBase.PickerInputBase.classes, ...DatePicker.DatePicker.classes };
DateTimePicker.displayName = "@mantine/dates/DateTimePicker";

exports.DateTimePicker = DateTimePicker;
//# sourceMappingURL=DateTimePicker.cjs.map
