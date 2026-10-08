'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var TimePicker_context = require('../TimePicker.context.cjs');

const AmPmInput = react.forwardRef(
  ({
    labels,
    value,
    onChange,
    className,
    style,
    onPreviousInput,
    readOnly,
    onMouseDown,
    onTouchStart,
    inputType,
    ...others
  }, ref) => {
    const ctx = TimePicker_context.useTimePickerContext();
    const handleKeyDown = (event) => {
      if (readOnly) {
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        onChange(labels.am);
      }
      if (event.key === "End") {
        event.preventDefault();
        onChange(labels.pm);
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        if (value === null) {
          onPreviousInput?.();
        } else {
          onChange(null);
        }
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPreviousInput?.();
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        onChange(value === labels.am ? labels.pm : labels.am);
      }
      if (event.code === "KeyA") {
        event.preventDefault();
        onChange(labels.am);
      }
      if (event.code === "KeyP") {
        event.preventDefault();
        onChange(labels.pm);
      }
    };
    if (inputType === "input") {
      const displayValue = value || "--";
      const inputSize = displayValue.length + 1;
      return /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          ...ctx.getStyles("field", { className, style }),
          ref,
          value: displayValue,
          size: inputSize,
          readOnly: true,
          onChange: () => {
          },
          onClick: ((event) => event.stopPropagation()),
          onKeyDown: handleKeyDown,
          onMouseDown: (event) => {
            event.stopPropagation();
            onMouseDown?.(event);
          },
          "data-am-pm": true,
          ...others
        }
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "select",
      {
        ...ctx.getStyles("field", { className, style }),
        ref,
        value: value || "",
        onChange: (event) => !readOnly && onChange(event.target.value || null),
        onClick: (event) => event.stopPropagation(),
        onKeyDown: handleKeyDown,
        onMouseDown: (event) => {
          event.stopPropagation();
          onMouseDown?.(event);
        },
        "data-am-pm": true,
        ...others,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "--" }),
          /* @__PURE__ */ jsxRuntime.jsx("option", { value: labels.am, children: labels.am }),
          /* @__PURE__ */ jsxRuntime.jsx("option", { value: labels.pm, children: labels.pm })
        ]
      }
    );
  }
);
AmPmInput.displayName = "@mantine/dates/AmPmInput";

exports.AmPmInput = AmPmInput;
//# sourceMappingURL=AmPmInput.cjs.map
