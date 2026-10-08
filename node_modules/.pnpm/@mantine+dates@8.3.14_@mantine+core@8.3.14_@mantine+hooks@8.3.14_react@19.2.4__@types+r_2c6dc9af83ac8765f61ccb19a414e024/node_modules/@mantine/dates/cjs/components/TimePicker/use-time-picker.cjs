'use client';
'use strict';

var react = require('react');
var hooks = require('@mantine/hooks');
var clampTime = require('./utils/clamp-time/clamp-time.cjs');
var getParsedTime = require('./utils/get-parsed-time/get-parsed-time.cjs');
var getTimeString = require('./utils/get-time-string/get-time-string.cjs');

function useTimePicker({
  value,
  defaultValue,
  onChange,
  format,
  amPmLabels,
  withSeconds = false,
  min,
  max,
  clearable,
  readOnly,
  disabled,
  pasteSplit
}) {
  const parsedTime = getParsedTime.getParsedTime({
    time: value || defaultValue || "",
    amPmLabels,
    format
  });
  const initialTimeString = getTimeString.getTimeString({
    hours: parsedTime.hours,
    minutes: parsedTime.minutes,
    seconds: parsedTime.seconds,
    format,
    withSeconds,
    amPm: parsedTime.amPm,
    amPmLabels
  });
  const acceptChange = react.useRef(true);
  const wasInvalidBefore = react.useRef(!initialTimeString.valid);
  const [hours, setHours] = react.useState(parsedTime.hours);
  const [minutes, setMinutes] = react.useState(parsedTime.minutes);
  const [seconds, setSeconds] = react.useState(parsedTime.seconds);
  const [amPm, setAmPm] = react.useState(parsedTime.amPm);
  const isClearable = clearable && !readOnly && !disabled && (hours !== null || minutes !== null || seconds !== null || amPm !== null);
  const hoursRef = react.useRef(null);
  const minutesRef = react.useRef(null);
  const secondsRef = react.useRef(null);
  const amPmRef = react.useRef(null);
  const focus = (field) => {
    if (field === "hours") {
      hoursRef.current?.focus();
    }
    if (field === "minutes") {
      minutesRef.current?.focus();
    }
    if (field === "seconds") {
      secondsRef.current?.focus();
    }
    if (field === "amPm") {
      amPmRef.current?.focus();
    }
  };
  const handleTimeChange = (field, val) => {
    const computedValue = { hours, minutes, seconds, amPm, [field]: val };
    const timeString = getTimeString.getTimeString({ ...computedValue, format, withSeconds, amPmLabels });
    if (timeString.valid) {
      acceptChange.current = false;
      wasInvalidBefore.current = false;
      if (field === "hours") {
        setHours(val);
      }
      if (field === "minutes") {
        setMinutes(val);
      }
      if (field === "seconds") {
        setSeconds(val);
      }
      if (field === "amPm") {
        setAmPm(val);
      }
      onChange?.(timeString.value);
    } else {
      acceptChange.current = false;
      if (!wasInvalidBefore.current) {
        onChange?.("");
        wasInvalidBefore.current = true;
      }
    }
  };
  const setTimeString = (timeString) => {
    acceptChange.current = false;
    const parsedTime2 = getParsedTime.getParsedTime({ time: timeString, amPmLabels, format });
    setHours(parsedTime2.hours);
    setMinutes(parsedTime2.minutes);
    setSeconds(parsedTime2.seconds);
    setAmPm(parsedTime2.amPm);
    const next = getTimeString.getTimeString({ ...parsedTime2, format, withSeconds, amPmLabels });
    wasInvalidBefore.current = !next.valid;
    onChange?.(timeString);
  };
  const onHoursChange = (value2) => {
    let adjustedValue = value2;
    if (format === "12h" && typeof value2 === "number" && value2 > 12) {
      adjustedValue = (value2 - 1) % 12 + 1;
    }
    setHours(adjustedValue);
    handleTimeChange("hours", adjustedValue);
    focus("hours");
  };
  const onMinutesChange = (value2) => {
    setMinutes(value2);
    handleTimeChange("minutes", value2);
    focus("minutes");
  };
  const onSecondsChange = (value2) => {
    setSeconds(value2);
    handleTimeChange("seconds", value2);
    focus("seconds");
  };
  const onAmPmChange = (value2) => {
    setAmPm(value2);
    handleTimeChange("amPm", value2);
    focus("amPm");
  };
  const clear = () => {
    acceptChange.current = false;
    setHours(null);
    setMinutes(null);
    setSeconds(null);
    setAmPm(null);
    onChange?.("");
    wasInvalidBefore.current = true;
    focus("hours");
  };
  const onPaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData("text");
    const parsedTime2 = (pasteSplit || getParsedTime.getParsedTime)({ time: pastedValue, format, amPmLabels });
    const timeString = getTimeString.getTimeString({ ...parsedTime2, format, withSeconds, amPmLabels });
    if (timeString.valid) {
      acceptChange.current = false;
      const clamped = clampTime.clampTime(timeString.value, min || "00:00:00", max || "23:59:59");
      onChange?.(clamped.timeString);
      setHours(parsedTime2.hours);
      setMinutes(parsedTime2.minutes);
      setSeconds(parsedTime2.seconds);
      setAmPm(parsedTime2.amPm);
    }
  };
  const hiddenInputValue = getTimeString.getTimeString({
    hours,
    minutes,
    seconds,
    format,
    withSeconds,
    amPm,
    amPmLabels
  });
  hooks.useDidUpdate(() => {
    if (value === "") {
      acceptChange.current = false;
      setHours(null);
      setMinutes(null);
      setSeconds(null);
      setAmPm(null);
      acceptChange.current = true;
      return;
    }
    if (acceptChange.current && typeof value === "string") {
      const parsedTime2 = getParsedTime.getParsedTime({ time: value || "", amPmLabels, format });
      setHours(parsedTime2.hours);
      setMinutes(parsedTime2.minutes);
      setSeconds(parsedTime2.seconds);
      setAmPm(parsedTime2.amPm);
    }
    acceptChange.current = true;
  }, [value]);
  return {
    refs: { hours: hoursRef, minutes: minutesRef, seconds: secondsRef, amPm: amPmRef },
    values: { hours, minutes, seconds, amPm },
    setHours: onHoursChange,
    setMinutes: onMinutesChange,
    setSeconds: onSecondsChange,
    setAmPm: onAmPmChange,
    focus,
    clear,
    onPaste,
    setTimeString,
    isClearable,
    hiddenInputValue: hiddenInputValue.value
  };
}

exports.useTimePicker = useTimePicker;
//# sourceMappingURL=use-time-picker.cjs.map
