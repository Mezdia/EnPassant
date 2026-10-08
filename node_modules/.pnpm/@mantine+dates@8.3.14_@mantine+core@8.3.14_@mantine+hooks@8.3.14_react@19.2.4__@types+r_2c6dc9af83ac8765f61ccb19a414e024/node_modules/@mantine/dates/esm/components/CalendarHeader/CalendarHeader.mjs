'use client';
import { jsx } from 'react/jsx-runtime';
import { createElement } from 'react';
import { createVarsResolver, getFontSize, getSize, factory, useProps, useStyles, UnstyledButton, AccordionChevron, Box } from '@mantine/core';
import classes from './CalendarHeader.module.css.mjs';

const defaultProps = {
  hasNextLevel: true,
  withNext: true,
  withPrevious: true,
  headerControlsOrder: ["previous", "level", "next"]
};
const varsResolver = createVarsResolver((_, { size }) => ({
  calendarHeader: {
    "--dch-control-size": getSize(size, "dch-control-size"),
    "--dch-fz": getFontSize(size)
  }
}));
const CalendarHeader = factory((_props, ref) => {
  const props = useProps("CalendarHeader", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    nextIcon,
    previousIcon,
    nextLabel,
    previousLabel,
    onNext,
    onPrevious,
    onLevelClick,
    label,
    nextDisabled,
    previousDisabled,
    hasNextLevel,
    levelControlAriaLabel,
    withNext,
    withPrevious,
    headerControlsOrder,
    __staticSelector,
    __preventFocus,
    __stopPropagation,
    attributes,
    ...others
  } = props;
  const getStyles = useStyles({
    name: __staticSelector || "CalendarHeader",
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
    rootSelector: "calendarHeader"
  });
  const preventFocus = __preventFocus ? (event) => event.preventDefault() : void 0;
  const previousControl = withPrevious && /* @__PURE__ */ createElement(
    UnstyledButton,
    {
      ...getStyles("calendarHeaderControl"),
      key: "previous",
      "data-direction": "previous",
      "aria-label": previousLabel,
      onClick: onPrevious,
      unstyled,
      onMouseDown: preventFocus,
      disabled: previousDisabled,
      "data-disabled": previousDisabled || void 0,
      tabIndex: __preventFocus || previousDisabled ? -1 : 0,
      "data-mantine-stop-propagation": __stopPropagation || void 0
    },
    previousIcon || /* @__PURE__ */ jsx(
      AccordionChevron,
      {
        ...getStyles("calendarHeaderControlIcon"),
        "data-direction": "previous",
        size: "45%"
      }
    )
  );
  const levelControl = /* @__PURE__ */ createElement(
    UnstyledButton,
    {
      component: hasNextLevel ? "button" : "div",
      ...getStyles("calendarHeaderLevel"),
      key: "level",
      onClick: hasNextLevel ? onLevelClick : void 0,
      unstyled,
      onMouseDown: hasNextLevel ? preventFocus : void 0,
      disabled: !hasNextLevel,
      "data-static": !hasNextLevel || void 0,
      "aria-label": levelControlAriaLabel,
      tabIndex: __preventFocus || !hasNextLevel ? -1 : 0,
      "data-mantine-stop-propagation": __stopPropagation || void 0
    },
    label
  );
  const nextControl = withNext && /* @__PURE__ */ createElement(
    UnstyledButton,
    {
      ...getStyles("calendarHeaderControl"),
      key: "next",
      "data-direction": "next",
      "aria-label": nextLabel,
      onClick: onNext,
      unstyled,
      onMouseDown: preventFocus,
      disabled: nextDisabled,
      "data-disabled": nextDisabled || void 0,
      tabIndex: __preventFocus || nextDisabled ? -1 : 0,
      "data-mantine-stop-propagation": __stopPropagation || void 0
    },
    nextIcon || /* @__PURE__ */ jsx(
      AccordionChevron,
      {
        ...getStyles("calendarHeaderControlIcon"),
        "data-direction": "next",
        size: "45%"
      }
    )
  );
  const controls = headerControlsOrder.map((control) => {
    if (control === "previous") {
      return previousControl;
    }
    if (control === "level") {
      return levelControl;
    }
    if (control === "next") {
      return nextControl;
    }
    return null;
  });
  return /* @__PURE__ */ jsx(Box, { ...getStyles("calendarHeader"), ref, ...others, children: controls });
});
CalendarHeader.classes = classes;
CalendarHeader.displayName = "@mantine/dates/CalendarHeader";

export { CalendarHeader };
//# sourceMappingURL=CalendarHeader.mjs.map
