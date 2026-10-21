'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var hooks = require('@mantine/hooks');
var padTime = require('../TimePicker/utils/pad-time/pad-time.cjs');

const getMaxDigit = (max) => Number(max.toFixed(0)[0]);
const SpinInput = react.forwardRef(
  ({
    value,
    min,
    max,
    onChange,
    focusable,
    step,
    onNextInput,
    onPreviousInput,
    onFocus,
    readOnly,
    allowTemporaryZero = false,
    placeholder = "--",
    ...others
  }, ref) => {
    const maxDigit = getMaxDigit(max);
    const arrowsMax = max + 1 - step;
    const handleChange = (value2) => {
      if (readOnly) {
        return;
      }
      const clearValue = value2.replace(/\D/g, "");
      if (clearValue !== "") {
        const parsedValue = parseInt(clearValue, 10);
        const clampedValue = allowTemporaryZero && parsedValue === 0 && min > 0 ? 0 : hooks.clamp(parsedValue, min, max);
        onChange(clampedValue);
        if (clampedValue > maxDigit || value2.startsWith("00")) {
          onNextInput?.();
        }
      }
    };
    const handleKeyDown = (event) => {
      if (readOnly) {
        return;
      }
      if (event.key === "0" || event.key === "Num0") {
        if (value === 0) {
          event.preventDefault();
          onNextInput?.();
        }
      }
      if (event.key === "Home") {
        event.preventDefault();
        onChange(min);
      }
      if (event.key === "End") {
        event.preventDefault();
        onChange(max);
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        if (value !== null) {
          onChange(null);
        } else {
          onPreviousInput?.();
        }
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNextInput?.();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPreviousInput?.();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const newValue = value === null ? min : hooks.clamp(value + step, min, arrowsMax);
        onChange(newValue);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const newValue = value === null ? arrowsMax : hooks.clamp(value - step, min, arrowsMax);
        onChange(newValue);
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        ref,
        type: "text",
        role: "spinbutton",
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": value === null ? 0 : value,
        "data-empty": value === null || void 0,
        inputMode: "numeric",
        placeholder,
        value: value === null ? "" : padTime.padTime(value),
        onChange: (event) => handleChange(event.currentTarget.value),
        onKeyDown: handleKeyDown,
        onFocus: (event) => {
          event.currentTarget.select();
          onFocus?.(event);
        },
        onClick: (event) => {
          event.stopPropagation();
          event.currentTarget.select();
        },
        onMouseDown: (event) => event.stopPropagation(),
        ...others
      }
    );
  }
);
SpinInput.displayName = "@mantine/dates/SpinInput";

exports.SpinInput = SpinInput;
//# sourceMappingURL=SpinInput.cjs.map
