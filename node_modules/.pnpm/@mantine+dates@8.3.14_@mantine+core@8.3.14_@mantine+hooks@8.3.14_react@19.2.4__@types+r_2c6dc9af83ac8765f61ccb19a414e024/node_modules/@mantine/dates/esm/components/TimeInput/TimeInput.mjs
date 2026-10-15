'use client';
import { jsx } from 'react/jsx-runtime';
import cx from 'clsx';
import { factory, useProps, useResolvedStylesApi, InputBase } from '@mantine/core';
import classes from './TimeInput.module.css.mjs';

const TimeInput = factory((_props, ref) => {
  const props = useProps("TimeInput", null, _props);
  const {
    classNames,
    styles,
    unstyled,
    vars,
    withSeconds,
    minTime,
    maxTime,
    value,
    onChange,
    step,
    ...others
  } = props;
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const checkIfTimeLimitExceeded = (val) => {
    if (minTime !== void 0 || maxTime !== void 0) {
      const [hours, minutes, seconds] = val.split(":").map(Number);
      if (minTime) {
        const [minHours, minMinutes, minSeconds] = minTime.split(":").map(Number);
        if (hours < minHours || hours === minHours && minutes < minMinutes || withSeconds && hours === minHours && minutes === minMinutes && seconds < minSeconds) {
          return -1;
        }
      }
      if (maxTime) {
        const [maxHours, maxMinutes, maxSeconds] = maxTime.split(":").map(Number);
        if (hours > maxHours || hours === maxHours && minutes > maxMinutes || withSeconds && hours === maxHours && minutes === maxMinutes && seconds > maxSeconds) {
          return 1;
        }
      }
    }
    return 0;
  };
  const onTimeBlur = (event) => {
    props.onBlur?.(event);
    if (minTime !== void 0 || maxTime !== void 0) {
      const val = event.currentTarget.value;
      if (val) {
        const check = checkIfTimeLimitExceeded(val);
        if (check === 1) {
          if (maxTime) {
            event.currentTarget.value = maxTime;
          }
          props.onChange?.(event);
        } else if (check === -1) {
          if (minTime) {
            event.currentTarget.value = minTime;
          }
          props.onChange?.(event);
        }
      }
    }
  };
  return /* @__PURE__ */ jsx(
    InputBase,
    {
      classNames: { ...resolvedClassNames, input: cx(classes.input, resolvedClassNames?.input) },
      styles: resolvedStyles,
      unstyled,
      ref,
      value,
      step: step ?? (withSeconds ? 1 : 60),
      ...others,
      onChange,
      onBlur: onTimeBlur,
      type: "time",
      __staticSelector: "TimeInput"
    }
  );
});
TimeInput.classes = InputBase.classes;
TimeInput.displayName = "@mantine/dates/TimeInput";

export { TimeInput };
//# sourceMappingURL=TimeInput.mjs.map
