'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var cx = require('clsx');
var core = require('@mantine/core');
var TimeValue = require('../TimeValue/TimeValue.cjs');
var TimeGrid_context = require('./TimeGrid.context.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var cx__default = /*#__PURE__*/_interopDefault(cx);

function TimeGridControl({
  time,
  active,
  className,
  amPmLabels,
  format,
  withSeconds,
  ...others
}) {
  const ctx = TimeGrid_context.useTimeGridContext();
  const theme = core.useMantineTheme();
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.UnstyledButton,
    {
      mod: [{ active }],
      ...ctx.getStyles("control", { className: cx__default.default(theme.activeClassName, className) }),
      ...others,
      children: /* @__PURE__ */ jsxRuntime.jsx(TimeValue.TimeValue, { value: time, format, amPmLabels, withSeconds })
    }
  );
}

exports.TimeGridControl = TimeGridControl;
//# sourceMappingURL=TimeGridControl.cjs.map
