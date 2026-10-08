'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var core = require('@mantine/core');
var hooks = require('@mantine/hooks');
var SpinInput = require('../SpinInput/SpinInput.cjs');
var AmPmInput = require('./AmPmInput/AmPmInput.cjs');
var AmPmControlsList = require('./TimeControlsList/AmPmControlsList.cjs');
var TimeControlsList = require('./TimeControlsList/TimeControlsList.cjs');
var TimePicker_context = require('./TimePicker.context.cjs');
var TimePicker_module = require('./TimePicker.module.css.cjs');
var TimePresets = require('./TimePresets/TimePresets.cjs');
var useTimePicker = require('./use-time-picker.cjs');
var clampTime = require('./utils/clamp-time/clamp-time.cjs');
var getParsedTime = require('./utils/get-parsed-time/get-parsed-time.cjs');
var getTimeString = require('./utils/get-time-string/get-time-string.cjs');

const defaultProps = {
  hoursStep: 1,
  minutesStep: 1,
  secondsStep: 1,
  format: "24h",
  amPmLabels: { am: "AM", pm: "PM" },
  pasteSplit: getParsedTime.getParsedTime,
  maxDropdownContentHeight: 200,
  hoursPlaceholder: "--",
  minutesPlaceholder: "--",
  secondsPlaceholder: "--"
};
const varsResolver = core.createVarsResolver((_theme, { size }) => ({
  dropdown: {
    "--control-font-size": core.getFontSize(size)
  }
}));
const TimePicker = core.factory((_props, ref) => {
  const props = core.useProps("TimePicker", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    onClick,
    format,
    value,
    defaultValue,
    onChange,
    hoursStep,
    minutesStep,
    secondsStep,
    withSeconds,
    hoursInputLabel,
    minutesInputLabel,
    secondsInputLabel,
    amPmInputLabel,
    amPmLabels,
    clearable,
    onMouseDown,
    onFocusCapture,
    onBlurCapture,
    min,
    max,
    popoverProps,
    withDropdown,
    rightSection,
    onFocus,
    onBlur,
    clearButtonProps,
    hoursInputProps,
    minutesInputProps,
    secondsInputProps,
    amPmSelectProps,
    readOnly,
    disabled,
    size,
    name,
    form,
    hiddenInputProps,
    labelProps,
    pasteSplit,
    hoursRef,
    minutesRef,
    secondsRef,
    amPmRef,
    presets,
    maxDropdownContentHeight,
    scrollAreaProps,
    attributes,
    reverseTimeControlsList,
    hoursPlaceholder,
    minutesPlaceholder,
    secondsPlaceholder,
    ...others
  } = props;
  const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const getStyles = core.useStyles({
    name: "TimePicker",
    classes: TimePicker_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    varsResolver
  });
  const controller = useTimePicker.useTimePicker({
    value,
    defaultValue,
    onChange,
    format,
    amPmLabels,
    withSeconds,
    min,
    max,
    clearable,
    disabled,
    readOnly,
    pasteSplit
  });
  const _hoursRef = hooks.useMergedRef(controller.refs.hours, hoursRef);
  const _minutesRef = hooks.useMergedRef(controller.refs.minutes, minutesRef);
  const _secondsRef = hooks.useMergedRef(controller.refs.seconds, secondsRef);
  const _amPmRef = hooks.useMergedRef(controller.refs.amPm, amPmRef);
  const hoursInputId = hooks.useId();
  const hasFocusRef = react.useRef(false);
  const [dropdownOpened, setDropdownOpened] = react.useState(false);
  const handleFocus = (event) => {
    if (!hasFocusRef.current) {
      hasFocusRef.current = true;
      onFocus?.(event);
    }
  };
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      const computedValue = controller.values;
      const timeString = getTimeString.getTimeString({
        ...computedValue,
        format,
        amPmLabels,
        withSeconds: !!withSeconds
      });
      if (timeString.valid && (min || max)) {
        const clamped = clampTime.clampTime(timeString.value, min, max);
        if (clamped.timeString !== timeString.value) {
          controller.setTimeString(clamped.timeString);
        }
      }
      hasFocusRef.current = false;
      onBlur?.(event);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(TimePicker_context.TimePickerProvider, { value: { getStyles, scrollAreaProps, maxDropdownContentHeight }, children: /* @__PURE__ */ jsxRuntime.jsxs(
    core.Popover,
    {
      opened: dropdownOpened,
      transitionProps: { duration: 0 },
      position: "bottom-start",
      withRoles: false,
      disabled: disabled || readOnly || !withDropdown,
      ...popoverProps,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Target, { children: /* @__PURE__ */ jsxRuntime.jsxs(
          core.InputBase,
          {
            component: "div",
            size,
            disabled,
            ref,
            onClick: (event) => {
              onClick?.(event);
              controller.focus("hours");
            },
            onMouseDown: (event) => {
              event.preventDefault();
              onMouseDown?.(event);
            },
            onFocusCapture: (event) => {
              setDropdownOpened(true);
              onFocusCapture?.(event);
            },
            onBlurCapture: (event) => {
              setDropdownOpened(false);
              onBlurCapture?.(event);
            },
            rightSection: rightSection || controller.isClearable && /* @__PURE__ */ jsxRuntime.jsx(
              core.CloseButton,
              {
                ...clearButtonProps,
                size,
                onClick: (event) => {
                  controller.clear();
                  clearButtonProps?.onClick?.(event);
                },
                onMouseDown: (event) => {
                  event.preventDefault();
                  clearButtonProps?.onMouseDown?.(event);
                }
              }
            ),
            labelProps: { htmlFor: hoursInputId, ...labelProps },
            style,
            className,
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            __staticSelector: "TimePicker",
            ...others,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { ...getStyles("fieldsRoot"), dir: "ltr", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { ...getStyles("fieldsGroup"), onBlur: handleBlur, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  SpinInput.SpinInput,
                  {
                    id: hoursInputId,
                    ...hoursInputProps,
                    ...getStyles("field", {
                      className: hoursInputProps?.className,
                      style: hoursInputProps?.style
                    }),
                    value: controller.values.hours,
                    onChange: controller.setHours,
                    onNextInput: () => controller.focus("minutes"),
                    min: format === "12h" ? 1 : 0,
                    max: format === "12h" ? 12 : 23,
                    allowTemporaryZero: format === "12h",
                    focusable: true,
                    step: hoursStep,
                    ref: _hoursRef,
                    "aria-label": hoursInputLabel,
                    readOnly,
                    disabled,
                    onPaste: controller.onPaste,
                    onFocus: (event) => {
                      handleFocus(event);
                      hoursInputProps?.onFocus?.(event);
                    },
                    onBlur: (event) => {
                      const actualInputValue = event.currentTarget.value;
                      const numericValue = actualInputValue ? parseInt(actualInputValue, 10) : null;
                      if (format === "12h" && numericValue === 0) {
                        controller.setHours(12);
                      }
                      hoursInputProps?.onBlur?.(event);
                    },
                    placeholder: hoursPlaceholder
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: ":" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  SpinInput.SpinInput,
                  {
                    ...minutesInputProps,
                    ...getStyles("field", {
                      className: minutesInputProps?.className,
                      style: minutesInputProps?.style
                    }),
                    value: controller.values.minutes,
                    onChange: controller.setMinutes,
                    min: 0,
                    max: 59,
                    focusable: true,
                    step: minutesStep,
                    ref: _minutesRef,
                    onPreviousInput: () => controller.focus("hours"),
                    onNextInput: () => withSeconds ? controller.focus("seconds") : controller.focus("amPm"),
                    "aria-label": minutesInputLabel,
                    tabIndex: -1,
                    readOnly,
                    disabled,
                    onPaste: controller.onPaste,
                    onFocus: (event) => {
                      handleFocus(event);
                      minutesInputProps?.onFocus?.(event);
                    },
                    placeholder: minutesPlaceholder
                  }
                ),
                withSeconds && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", { children: ":" }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    SpinInput.SpinInput,
                    {
                      ...secondsInputProps,
                      ...getStyles("field", {
                        className: secondsInputProps?.className,
                        style: secondsInputProps?.style
                      }),
                      value: controller.values.seconds,
                      onChange: controller.setSeconds,
                      min: 0,
                      max: 59,
                      focusable: true,
                      step: secondsStep,
                      ref: _secondsRef,
                      onPreviousInput: () => controller.focus("minutes"),
                      onNextInput: () => controller.focus("amPm"),
                      "aria-label": secondsInputLabel,
                      tabIndex: -1,
                      readOnly,
                      disabled,
                      onPaste: controller.onPaste,
                      onFocus: (event) => {
                        handleFocus(event);
                        secondsInputProps?.onFocus?.(event);
                      },
                      placeholder: secondsPlaceholder
                    }
                  )
                ] }),
                format === "12h" && /* @__PURE__ */ jsxRuntime.jsx(
                  AmPmInput.AmPmInput,
                  {
                    ...amPmSelectProps,
                    inputType: withDropdown ? "input" : "select",
                    labels: amPmLabels,
                    value: controller.values.amPm,
                    onChange: controller.setAmPm,
                    ref: _amPmRef,
                    "aria-label": amPmInputLabel,
                    onPreviousInput: () => withSeconds ? controller.focus("seconds") : controller.focus("minutes"),
                    readOnly,
                    disabled,
                    tabIndex: -1,
                    onPaste: controller.onPaste,
                    onFocus: (event) => {
                      handleFocus(event);
                      amPmSelectProps?.onFocus?.(event);
                    }
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  type: "hidden",
                  name,
                  form,
                  value: controller.hiddenInputValue,
                  ...hiddenInputProps
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          core.Popover.Dropdown,
          {
            ...getStyles("dropdown"),
            onMouseDown: (event) => event.preventDefault(),
            children: presets ? /* @__PURE__ */ jsxRuntime.jsx(
              TimePresets.TimePresets,
              {
                value: controller.hiddenInputValue,
                onChange: controller.setTimeString,
                format,
                presets,
                amPmLabels,
                withSeconds: withSeconds || false
              }
            ) : /* @__PURE__ */ jsxRuntime.jsxs("div", { ...getStyles("controlsListGroup"), children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                TimeControlsList.TimeControlsList,
                {
                  min: format === "12h" ? 1 : 0,
                  max: format === "12h" ? 12 : 23,
                  step: hoursStep,
                  value: controller.values.hours,
                  onSelect: controller.setHours,
                  reversed: reverseTimeControlsList
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                TimeControlsList.TimeControlsList,
                {
                  min: 0,
                  max: 59,
                  step: minutesStep,
                  value: controller.values.minutes,
                  onSelect: controller.setMinutes,
                  reversed: reverseTimeControlsList
                }
              ),
              withSeconds && /* @__PURE__ */ jsxRuntime.jsx(
                TimeControlsList.TimeControlsList,
                {
                  min: 0,
                  max: 59,
                  step: secondsStep,
                  value: controller.values.seconds,
                  onSelect: controller.setSeconds,
                  reversed: reverseTimeControlsList
                }
              ),
              format === "12h" && /* @__PURE__ */ jsxRuntime.jsx(
                AmPmControlsList.AmPmControlsList,
                {
                  labels: amPmLabels,
                  value: controller.values.amPm,
                  onSelect: controller.setAmPm
                }
              )
            ] })
          }
        )
      ]
    }
  ) });
});
TimePicker.displayName = "@mantine/dates/TimePicker";
TimePicker.classes = TimePicker_module;

exports.TimePicker = TimePicker;
//# sourceMappingURL=TimePicker.cjs.map
