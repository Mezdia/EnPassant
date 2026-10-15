'use client';
import { jsx } from 'react/jsx-runtime';
import { createVarsResolver, getSize, getFontSize, factory, useProps, useStyles, UnstyledButton } from '@mantine/core';
import classes from './PickerControl.module.css.mjs';

const varsResolver = createVarsResolver((_, { size }) => ({
  pickerControl: {
    "--dpc-fz": getFontSize(size),
    "--dpc-size": getSize(size, "dpc-size")
  }
}));
const PickerControl = factory((_props, ref) => {
  const props = useProps("PickerControl", null, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    firstInRange,
    lastInRange,
    inRange,
    __staticSelector,
    selected,
    disabled,
    attributes,
    ...others
  } = props;
  const getStyles = useStyles({
    name: __staticSelector || "PickerControl",
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    varsResolver,
    rootSelector: "pickerControl"
  });
  return /* @__PURE__ */ jsx(
    UnstyledButton,
    {
      ...getStyles("pickerControl"),
      ref,
      unstyled,
      "data-picker-control": true,
      "data-selected": selected && !disabled || void 0,
      "data-disabled": disabled || void 0,
      "data-in-range": inRange && !disabled && !selected || void 0,
      "data-first-in-range": firstInRange && !disabled || void 0,
      "data-last-in-range": lastInRange && !disabled || void 0,
      disabled,
      ...others
    }
  );
});
PickerControl.classes = classes;
PickerControl.displayName = "@mantine/dates/PickerControl";

export { PickerControl };
//# sourceMappingURL=PickerControl.mjs.map
