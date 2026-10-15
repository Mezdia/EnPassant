'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var cx = require('clsx');
var core = require('@mantine/core');
var HiddenDatesInput = require('../HiddenDatesInput/HiddenDatesInput.cjs');
var PickerInputBase_module = require('./PickerInputBase.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var cx__default = /*#__PURE__*/_interopDefault(cx);

const PickerInputBase = core.factory((_props, ref) => {
  const {
    inputProps,
    wrapperProps,
    placeholder,
    classNames,
    styles,
    unstyled,
    popoverProps,
    modalProps,
    dropdownType,
    children,
    formattedValue,
    dropdownHandlers,
    dropdownOpened,
    onClick,
    clearable,
    onClear,
    clearButtonProps,
    rightSection,
    shouldClear,
    readOnly,
    disabled,
    value,
    name,
    form,
    type,
    onDropdownClose,
    withTime,
    ...others
  } = core.useInputProps("PickerInputBase", { size: "sm" }, _props);
  const clearButton = /* @__PURE__ */ jsxRuntime.jsx(core.Input.ClearButton, { onClick: onClear, unstyled, ...clearButtonProps });
  const handleClose = () => {
    const isInvalidRangeValue = type === "range" && Array.isArray(value) && value[0] && !value[1];
    if (isInvalidRangeValue) {
      onClear();
    }
    dropdownHandlers.close();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    dropdownType === "modal" && !readOnly && /* @__PURE__ */ jsxRuntime.jsx(
      core.Modal,
      {
        opened: dropdownOpened,
        onClose: handleClose,
        withCloseButton: false,
        size: "auto",
        "data-dates-modal": true,
        unstyled,
        ...modalProps,
        children
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(core.Input.Wrapper, { ...wrapperProps, children: /* @__PURE__ */ jsxRuntime.jsxs(
      core.Popover,
      {
        position: "bottom-start",
        opened: dropdownOpened,
        trapFocus: true,
        returnFocus: false,
        unstyled,
        onClose: onDropdownClose,
        ...popoverProps,
        disabled: popoverProps?.disabled || dropdownType === "modal" || readOnly,
        onChange: (_opened) => {
          if (!_opened) {
            popoverProps?.onClose?.();
            handleClose();
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Target, { children: /* @__PURE__ */ jsxRuntime.jsx(
            core.Input,
            {
              "data-dates-input": true,
              "data-read-only": readOnly || void 0,
              disabled,
              component: "button",
              type: "button",
              multiline: true,
              onClick: (event) => {
                onClick?.(event);
                dropdownHandlers.toggle();
              },
              __clearSection: clearButton,
              __clearable: clearable && shouldClear && !readOnly && !disabled,
              rightSection,
              ...inputProps,
              ref,
              classNames: { ...classNames, input: cx__default.default(PickerInputBase_module.input, classNames?.input) },
              ...others,
              children: formattedValue || /* @__PURE__ */ jsxRuntime.jsx(
                core.Input.Placeholder,
                {
                  error: inputProps.error,
                  unstyled,
                  classNames,
                  styles,
                  __staticSelector: inputProps.__staticSelector,
                  children: placeholder
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Dropdown, { "data-dates-dropdown": true, children })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(HiddenDatesInput.HiddenDatesInput, { value, name, form, type, withTime })
  ] });
});
PickerInputBase.classes = PickerInputBase_module;
PickerInputBase.displayName = "@mantine/dates/PickerInputBase";

exports.PickerInputBase = PickerInputBase;
//# sourceMappingURL=PickerInputBase.cjs.map
