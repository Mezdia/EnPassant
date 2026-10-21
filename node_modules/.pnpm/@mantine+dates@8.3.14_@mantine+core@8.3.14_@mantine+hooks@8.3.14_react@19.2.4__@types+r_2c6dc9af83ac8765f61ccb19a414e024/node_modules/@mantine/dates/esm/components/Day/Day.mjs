'use client';
import { jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { createVarsResolver, getSize, factory, useProps, useStyles, UnstyledButton } from '@mantine/core';
import classes from './Day.module.css.mjs';

const varsResolver = createVarsResolver((_, { size }) => ({
  day: {
    "--day-size": getSize(size, "day-size")
  }
}));
const Day = factory((_props, ref) => {
  const props = useProps("Day", null, _props);
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
  const getStyles = useStyles({
    name: __staticSelector || "Day",
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
    rootSelector: "day"
  });
  return /* @__PURE__ */ jsx(
    UnstyledButton,
    {
      ...getStyles("day", { style: hidden ? { display: "none" } : void 0 }),
      component: isStatic ? "div" : "button",
      ref,
      disabled,
      "data-today": dayjs(date).isSame(/* @__PURE__ */ new Date(), "day") || void 0,
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
      children: renderDay?.(date) || dayjs(date).date()
    }
  );
});
Day.classes = classes;
Day.displayName = "@mantine/dates/Day";

export { Day };
//# sourceMappingURL=Day.mjs.map
