'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var hooks = require('@mantine/hooks');
var toDateString = require('../../utils/to-date-string/to-date-string.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var MiniCalendar_module = require('./MiniCalendar.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  size: "sm",
  numberOfDays: 7,
  monthLabelFormat: "MMM"
};
const varsResolver = core.createVarsResolver((_theme, { size }) => ({
  root: {
    "--mini-calendar-font-size": core.getSize(size, "mantine-font-size")
  }
}));
const MiniCalendar = core.factory((_props, ref) => {
  const props = core.useProps("MiniCalendar", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    date,
    defaultDate,
    onDateChange,
    value,
    onChange,
    onNext,
    onPrevious,
    getDayProps,
    numberOfDays,
    size,
    minDate,
    maxDate,
    monthLabelFormat,
    nextControlProps,
    previousControlProps,
    locale,
    ...others
  } = props;
  const getStyles = core.useStyles({
    name: "MiniCalendar",
    classes: MiniCalendar_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const ctx = useDatesContext.useDatesContext();
  const _locale = ctx.getLocale(locale);
  const [_date, setDate] = hooks.useUncontrolled({
    value: toDateString.toDateString(date),
    defaultValue: toDateString.toDateString(defaultDate),
    finalValue: toDateString.toDateString(value) || dayjs__default.default().format("YYYY-MM-DD"),
    onChange: onDateChange
  });
  const handleNext = () => {
    onNext?.();
    const nextDate = dayjs__default.default(_date).add(numberOfDays, "days");
    setDate(toDateString.toDateString(nextDate));
  };
  const handlePrevious = () => {
    onPrevious?.();
    const previousDate = dayjs__default.default(_date).subtract(numberOfDays, "days");
    setDate(toDateString.toDateString(previousDate));
  };
  const previousDisabled = minDate ? dayjs__default.default(_date).subtract(1, "days").isBefore(dayjs__default.default(minDate)) : false;
  const nextDisabled = maxDate ? dayjs__default.default(_date).add(numberOfDays, "days").isAfter(dayjs__default.default(maxDate)) : false;
  const range = Array(numberOfDays).fill(0).map((_, index) => dayjs__default.default(_date).add(index, "days")).map((date2) => {
    const disabled = minDate && date2.isBefore(dayjs__default.default(minDate), "day") || maxDate && date2.isAfter(dayjs__default.default(maxDate), "day") || false;
    const dayProps = getDayProps?.(toDateString.toDateString(date2));
    return /* @__PURE__ */ jsxRuntime.jsxs(
      core.UnstyledButton,
      {
        disabled,
        "aria-label": date2.format("YYYY-MM-DD"),
        "data-disabled": disabled || void 0,
        "data-selected": value && dayjs__default.default(date2).isSame(value, "day") ? true : void 0,
        ...dayProps,
        onClick: (event) => {
          dayProps?.onClick?.(event);
          onChange?.(toDateString.toDateString(date2));
        },
        ...getStyles("day", {
          active: !disabled,
          className: dayProps?.className,
          style: dayProps?.style
        }),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { ...getStyles("dayMonth"), children: date2.locale(_locale).format(monthLabelFormat) }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { ...getStyles("dayNumber"), children: date2.date() })
        ]
      },
      date2.toString()
    );
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { ref, size, ...getStyles("root"), ...others, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      core.UnstyledButton,
      {
        size,
        onClick: handlePrevious,
        disabled: previousDisabled,
        "data-disabled": previousDisabled || void 0,
        "data-direction": "previous",
        ...previousControlProps,
        ...getStyles("control", {
          active: !previousDisabled,
          className: previousControlProps?.className,
          style: previousControlProps?.style
        }),
        children: previousControlProps?.children || /* @__PURE__ */ jsxRuntime.jsx(core.AccordionChevron, { "data-chevron": true, size })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { ...getStyles("days"), children: range }),
    /* @__PURE__ */ jsxRuntime.jsx(
      core.UnstyledButton,
      {
        size,
        onClick: handleNext,
        disabled: nextDisabled,
        "data-disabled": nextDisabled || void 0,
        "data-direction": "next",
        ...nextControlProps,
        ...getStyles("control", {
          active: !nextDisabled,
          className: nextControlProps?.className,
          style: nextControlProps?.style
        }),
        children: nextControlProps?.children || /* @__PURE__ */ jsxRuntime.jsx(core.AccordionChevron, { "data-chevron": true, size })
      }
    )
  ] });
});
MiniCalendar.displayName = "@mantine/dates/MiniCalendar";
MiniCalendar.classes = MiniCalendar_module;

exports.MiniCalendar = MiniCalendar;
//# sourceMappingURL=MiniCalendar.cjs.map
