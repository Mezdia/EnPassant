'use client';
import { useRef, useState } from 'react';
import { useDidUpdate } from '@mantine/hooks';
import { clampTime } from './utils/clamp-time/clamp-time.mjs';
import { getParsedTime } from './utils/get-parsed-time/get-parsed-time.mjs';
import { getTimeString } from './utils/get-time-string/get-time-string.mjs';

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
  const parsedTime = getParsedTime({
    time: value || defaultValue || "",
    amPmLabels,
    format
  });
  const initialTimeString = getTimeString({
    hours: parsedTime.hours,
    minutes: parsedTime.minutes,
    seconds: parsedTime.seconds,
    format,
    withSeconds,
    amPm: parsedTime.amPm,
    amPmLabels
  });
  const acceptChange = useRef(true);
  const wasInvalidBefore = useRef(!initialTimeString.valid);
  const [hours, setHours] = useState(parsedTime.hours);
  const [minutes, setMinutes] = useState(parsedTime.minutes);
  const [seconds, setSeconds] = useState(parsedTime.seconds);
  const [amPm, setAmPm] = useState(parsedTime.amPm);
  const isClearable = clearable && !readOnly && !disabled && (hours !== null || minutes !== null || seconds !== null || amPm !== null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);
  const amPmRef = useRef(null);
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
    const timeString = getTimeString({ ...computedValue, format, withSeconds, amPmLabels });
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
    const parsedTime2 = getParsedTime({ time: timeString, amPmLabels, format });
    setHours(parsedTime2.hours);
    setMinutes(parsedTime2.minutes);
    setSeconds(parsedTime2.seconds);
    setAmPm(parsedTime2.amPm);
    const next = getTimeString({ ...parsedTime2, format, withSeconds, amPmLabels });
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
    const parsedTime2 = (pasteSplit || getParsedTime)({ time: pastedValue, format, amPmLabels });
    const timeString = getTimeString({ ...parsedTime2, format, withSeconds, amPmLabels });
    if (timeString.valid) {
      acceptChange.current = false;
      const clamped = clampTime(timeString.value, min || "00:00:00", max || "23:59:59");
      onChange?.(clamped.timeString);
      setHours(parsedTime2.hours);
      setMinutes(parsedTime2.minutes);
      setSeconds(parsedTime2.seconds);
      setAmPm(parsedTime2.amPm);
    }
  };
  const hiddenInputValue = getTimeString({
    hours,
    minutes,
    seconds,
    format,
    withSeconds,
    amPm,
    amPmLabels
  });
  useDidUpdate(() => {
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
      const parsedTime2 = getParsedTime({ time: value || "", amPmLabels, format });
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

export { useTimePicker };
//# sourceMappingURL=use-time-picker.mjs.map
