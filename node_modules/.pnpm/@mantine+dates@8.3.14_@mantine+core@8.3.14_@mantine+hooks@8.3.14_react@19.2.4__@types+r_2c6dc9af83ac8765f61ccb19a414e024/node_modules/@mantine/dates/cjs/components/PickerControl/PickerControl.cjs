'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var PickerControl_module = require('./PickerControl.module.css.cjs');

const varsResolver = core.createVarsResolver((_, { size }) => ({
  pickerControl: {
    "--dpc-fz": core.getFontSize(size),
    "--dpc-size": core.getSize(size, "dpc-size")
  }
}));
const PickerControl = core.factory((_props, ref) => {
  const props = core.useProps("PickerControl", null, _props);
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
  const getStyles = core.useStyles({
    name: __staticSelector || "PickerControl",
    classes: PickerControl_module,
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.UnstyledButton,
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
PickerControl.classes = PickerControl_module;
PickerControl.displayName = "@mantine/dates/PickerControl";

exports.PickerControl = PickerControl;
//# sourceMappingURL=PickerControl.cjs.map
