'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var core = require('@mantine/core');
var CalendarHeader_module = require('./CalendarHeader.module.css.cjs');

const defaultProps = {
  hasNextLevel: true,
  withNext: true,
  withPrevious: true,
  headerControlsOrder: ["previous", "level", "next"]
};
const varsResolver = core.createVarsResolver((_, { size }) => ({
  calendarHeader: {
    "--dch-control-size": core.getSize(size, "dch-control-size"),
    "--dch-fz": core.getFontSize(size)
  }
}));
const CalendarHeader = core.factory((_props, ref) => {
  const props = core.useProps("CalendarHeader", defaultProps, _props);
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
  const getStyles = core.useStyles({
    name: __staticSelector || "CalendarHeader",
    classes: CalendarHeader_module,
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
  const previousControl = withPrevious && /* @__PURE__ */ react.createElement(
    core.UnstyledButton,
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
    previousIcon || /* @__PURE__ */ jsxRuntime.jsx(
      core.AccordionChevron,
      {
        ...getStyles("calendarHeaderControlIcon"),
        "data-direction": "previous",
        size: "45%"
      }
    )
  );
  const levelControl = /* @__PURE__ */ react.createElement(
    core.UnstyledButton,
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
  const nextControl = withNext && /* @__PURE__ */ react.createElement(
    core.UnstyledButton,
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
    nextIcon || /* @__PURE__ */ jsxRuntime.jsx(
      core.AccordionChevron,
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
  return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ...getStyles("calendarHeader"), ref, ...others, children: controls });
});
CalendarHeader.classes = CalendarHeader_module;
CalendarHeader.displayName = "@mantine/dates/CalendarHeader";

exports.CalendarHeader = CalendarHeader;
//# sourceMappingURL=CalendarHeader.cjs.map
