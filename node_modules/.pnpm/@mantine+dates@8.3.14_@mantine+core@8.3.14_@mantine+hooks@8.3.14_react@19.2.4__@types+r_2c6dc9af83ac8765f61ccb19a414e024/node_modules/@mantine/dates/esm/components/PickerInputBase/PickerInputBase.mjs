'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import cx from 'clsx';
import { factory, useInputProps, Input, Modal, Popover } from '@mantine/core';
import { HiddenDatesInput } from '../HiddenDatesInput/HiddenDatesInput.mjs';
import classes from './PickerInputBase.module.css.mjs';

const PickerInputBase = factory((_props, ref) => {
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
  } = useInputProps("PickerInputBase", { size: "sm" }, _props);
  const clearButton = /* @__PURE__ */ jsx(Input.ClearButton, { onClick: onClear, unstyled, ...clearButtonProps });
  const handleClose = () => {
    const isInvalidRangeValue = type === "range" && Array.isArray(value) && value[0] && !value[1];
    if (isInvalidRangeValue) {
      onClear();
    }
    dropdownHandlers.close();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    dropdownType === "modal" && !readOnly && /* @__PURE__ */ jsx(
      Modal,
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
    /* @__PURE__ */ jsx(Input.Wrapper, { ...wrapperProps, children: /* @__PURE__ */ jsxs(
      Popover,
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
          /* @__PURE__ */ jsx(Popover.Target, { children: /* @__PURE__ */ jsx(
            Input,
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
              classNames: { ...classNames, input: cx(classes.input, classNames?.input) },
              ...others,
              children: formattedValue || /* @__PURE__ */ jsx(
                Input.Placeholder,
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
          /* @__PURE__ */ jsx(Popover.Dropdown, { "data-dates-dropdown": true, children })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(HiddenDatesInput, { value, name, form, type, withTime })
  ] });
});
PickerInputBase.classes = classes;
PickerInputBase.displayName = "@mantine/dates/PickerInputBase";

export { PickerInputBase };
//# sourceMappingURL=PickerInputBase.mjs.map
