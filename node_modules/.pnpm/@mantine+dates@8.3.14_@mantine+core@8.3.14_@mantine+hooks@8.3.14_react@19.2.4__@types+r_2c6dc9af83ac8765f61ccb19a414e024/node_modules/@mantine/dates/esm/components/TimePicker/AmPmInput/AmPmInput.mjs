'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { forwardRef } from 'react';
import { useTimePickerContext } from '../TimePicker.context.mjs';

const AmPmInput = forwardRef(
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
    const ctx = useTimePickerContext();
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
      return /* @__PURE__ */ jsx(
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
    return /* @__PURE__ */ jsxs(
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
          /* @__PURE__ */ jsx("option", { value: "", children: "--" }),
          /* @__PURE__ */ jsx("option", { value: labels.am, children: labels.am }),
          /* @__PURE__ */ jsx("option", { value: labels.pm, children: labels.pm })
        ]
      }
    );
  }
);
AmPmInput.displayName = "@mantine/dates/AmPmInput";

export { AmPmInput };
//# sourceMappingURL=AmPmInput.mjs.map
