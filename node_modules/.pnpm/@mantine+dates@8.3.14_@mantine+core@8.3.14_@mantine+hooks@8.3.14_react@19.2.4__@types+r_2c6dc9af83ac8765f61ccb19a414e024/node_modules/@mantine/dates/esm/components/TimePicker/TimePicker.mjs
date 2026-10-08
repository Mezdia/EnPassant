'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useRef, useState } from 'react';
import { createVarsResolver, getFontSize, factory, useProps, useResolvedStylesApi, useStyles, Popover, InputBase, CloseButton } from '@mantine/core';
import { useMergedRef, useId } from '@mantine/hooks';
import { SpinInput } from '../SpinInput/SpinInput.mjs';
import { AmPmInput } from './AmPmInput/AmPmInput.mjs';
import { AmPmControlsList } from './TimeControlsList/AmPmControlsList.mjs';
import { TimeControlsList } from './TimeControlsList/TimeControlsList.mjs';
import { TimePickerProvider } from './TimePicker.context.mjs';
import classes from './TimePicker.module.css.mjs';
import { TimePresets } from './TimePresets/TimePresets.mjs';
import { useTimePicker } from './use-time-picker.mjs';
import { clampTime } from './utils/clamp-time/clamp-time.mjs';
import { getParsedTime } from './utils/get-parsed-time/get-parsed-time.mjs';
import { getTimeString } from './utils/get-time-string/get-time-string.mjs';

const defaultProps = {
  hoursStep: 1,
  minutesStep: 1,
  secondsStep: 1,
  format: "24h",
  amPmLabels: { am: "AM", pm: "PM" },
  pasteSplit: getParsedTime,
  maxDropdownContentHeight: 200,
  hoursPlaceholder: "--",
  minutesPlaceholder: "--",
  secondsPlaceholder: "--"
};
const varsResolver = createVarsResolver((_theme, { size }) => ({
  dropdown: {
    "--control-font-size": getFontSize(size)
  }
}));
const TimePicker = factory((_props, ref) => {
  const props = useProps("TimePicker", defaultProps, _props);
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
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const getStyles = useStyles({
    name: "TimePicker",
    classes,
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
  const controller = useTimePicker({
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
  const _hoursRef = useMergedRef(controller.refs.hours, hoursRef);
  const _minutesRef = useMergedRef(controller.refs.minutes, minutesRef);
  const _secondsRef = useMergedRef(controller.refs.seconds, secondsRef);
  const _amPmRef = useMergedRef(controller.refs.amPm, amPmRef);
  const hoursInputId = useId();
  const hasFocusRef = useRef(false);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const handleFocus = (event) => {
    if (!hasFocusRef.current) {
      hasFocusRef.current = true;
      onFocus?.(event);
    }
  };
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      const computedValue = controller.values;
      const timeString = getTimeString({
        ...computedValue,
        format,
        amPmLabels,
        withSeconds: !!withSeconds
      });
      if (timeString.valid && (min || max)) {
        const clamped = clampTime(timeString.value, min, max);
        if (clamped.timeString !== timeString.value) {
          controller.setTimeString(clamped.timeString);
        }
      }
      hasFocusRef.current = false;
      onBlur?.(event);
    }
  };
  return /* @__PURE__ */ jsx(TimePickerProvider, { value: { getStyles, scrollAreaProps, maxDropdownContentHeight }, children: /* @__PURE__ */ jsxs(
    Popover,
    {
      opened: dropdownOpened,
      transitionProps: { duration: 0 },
      position: "bottom-start",
      withRoles: false,
      disabled: disabled || readOnly || !withDropdown,
      ...popoverProps,
      children: [
        /* @__PURE__ */ jsx(Popover.Target, { children: /* @__PURE__ */ jsxs(
          InputBase,
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
            rightSection: rightSection || controller.isClearable && /* @__PURE__ */ jsx(
              CloseButton,
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
              /* @__PURE__ */ jsx("div", { ...getStyles("fieldsRoot"), dir: "ltr", children: /* @__PURE__ */ jsxs("div", { ...getStyles("fieldsGroup"), onBlur: handleBlur, children: [
                /* @__PURE__ */ jsx(
                  SpinInput,
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
                /* @__PURE__ */ jsx("span", { children: ":" }),
                /* @__PURE__ */ jsx(
                  SpinInput,
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
                withSeconds && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { children: ":" }),
                  /* @__PURE__ */ jsx(
                    SpinInput,
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
                format === "12h" && /* @__PURE__ */ jsx(
                  AmPmInput,
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
              /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(
          Popover.Dropdown,
          {
            ...getStyles("dropdown"),
            onMouseDown: (event) => event.preventDefault(),
            children: presets ? /* @__PURE__ */ jsx(
              TimePresets,
              {
                value: controller.hiddenInputValue,
                onChange: controller.setTimeString,
                format,
                presets,
                amPmLabels,
                withSeconds: withSeconds || false
              }
            ) : /* @__PURE__ */ jsxs("div", { ...getStyles("controlsListGroup"), children: [
              /* @__PURE__ */ jsx(
                TimeControlsList,
                {
                  min: format === "12h" ? 1 : 0,
                  max: format === "12h" ? 12 : 23,
                  step: hoursStep,
                  value: controller.values.hours,
                  onSelect: controller.setHours,
                  reversed: reverseTimeControlsList
                }
              ),
              /* @__PURE__ */ jsx(
                TimeControlsList,
                {
                  min: 0,
                  max: 59,
                  step: minutesStep,
                  value: controller.values.minutes,
                  onSelect: controller.setMinutes,
                  reversed: reverseTimeControlsList
                }
              ),
              withSeconds && /* @__PURE__ */ jsx(
                TimeControlsList,
                {
                  min: 0,
                  max: 59,
                  step: secondsStep,
                  value: controller.values.seconds,
                  onSelect: controller.setSeconds,
                  reversed: reverseTimeControlsList
                }
              ),
              format === "12h" && /* @__PURE__ */ jsx(
                AmPmControlsList,
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
TimePicker.classes = classes;

export { TimePicker };
//# sourceMappingURL=TimePicker.mjs.map
