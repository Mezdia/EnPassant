'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var Day_module = require('./Day.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const varsResolver = core.createVarsResolver((_, { size }) => ({
  day: {
    "--day-size": core.getSize(size, "day-size")
  }
}));
const Day = core.factory((_props, ref) => {
  const props = core.useProps("Day", null, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    date,
    disabled,
    __staticSelector,
    weekend,
    outside,
    selected,
    renderDay,
    inRange,
    firstInRange,
    lastInRange,
    hidden,
    static: isStatic,
    highlightToday,
    attributes,
    ...others
  } = props;
  const getStyles = core.useStyles({
    name: __staticSelector || "Day",
    classes: Day_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    varsResolver,
    rootSelector: "day"
  });
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.UnstyledButton,
    {
      ...getStyles("day", { style: hidden ? { display: "none" } : void 0 }),
      component: isStatic ? "div" : "button",
      ref,
      disabled,
      "data-today": dayjs__default.default(date).isSame(/* @__PURE__ */ new Date(), "day") || void 0,
      "data-hidden": hidden || void 0,
      "data-highlight-today": highlightToday || void 0,
      "data-disabled": disabled || void 0,
      "data-weekend": !disabled && !outside && weekend || void 0,
      "data-outside": !disabled && outside || void 0,
      "data-selected": !disabled && selected || void 0,
      "data-in-range": inRange && !disabled || void 0,
      "data-first-in-range": firstInRange && !disabled || void 0,
      "data-last-in-range": lastInRange && !disabled || void 0,
      "data-static": isStatic || void 0,
      unstyled,
      ...others,
      children: renderDay?.(date) || dayjs__default.default(date).date()
    }
  );
});
Day.classes = Day_module;
Day.displayName = "@mantine/dates/Day";

exports.Day = Day;
//# sourceMappingURL=Day.cjs.map
