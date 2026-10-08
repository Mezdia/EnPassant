'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var CalendarHeader = require('../CalendarHeader/CalendarHeader.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var Month = require('../Month/Month.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  monthLabelFormat: "MMMM YYYY"
};
const MonthLevel = core.factory((_props, ref) => {
  const props = core.useProps("MonthLevel", defaultProps, _props);
  const {
    // Month settings
    month,
    locale,
    firstDayOfWeek,
    weekdayFormat,
    weekendDays,
    getDayProps,
    excludeDate,
    minDate,
    maxDate,
    renderDay,
    hideOutsideDates,
    hideWeekdays,
    getDayAriaLabel,
    __getDayRef,
    __onDayKeyDown,
    __onDayClick,
    __onDayMouseEnter,
    withCellSpacing,
    highlightToday,
    withWeekNumbers,
    // CalendarHeader settings
    __preventFocus,
    __stopPropagation,
    nextIcon,
    previousIcon,
    nextLabel,
    previousLabel,
    onNext,
    onPrevious,
    onLevelClick,
    nextDisabled,
    previousDisabled,
    hasNextLevel,
    levelControlAriaLabel,
    withNext,
    withPrevious,
    headerControlsOrder,
    // Other props
    monthLabelFormat,
    classNames,
    styles,
    unstyled,
    __staticSelector,
    size,
    static: isStatic,
    attributes,
    ...others
  } = props;
  const ctx = useDatesContext.useDatesContext();
  const stylesApiProps = {
    __staticSelector: __staticSelector || "MonthLevel",
    classNames,
    styles,
    unstyled,
    size,
    attributes
  };
  const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs__default.default(month).endOf("month").isBefore(maxDate) : false;
  const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs__default.default(month).startOf("month").isAfter(minDate) : false;
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { "data-month-level": true, size, ref, ...others, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      CalendarHeader.CalendarHeader,
      {
        label: typeof monthLabelFormat === "function" ? monthLabelFormat(month) : dayjs__default.default(month).locale(locale || ctx.locale).format(monthLabelFormat),
        __preventFocus,
        __stopPropagation,
        nextIcon,
        previousIcon,
        nextLabel,
        previousLabel,
        onNext,
        onPrevious,
        onLevelClick,
        nextDisabled: _nextDisabled,
        previousDisabled: _previousDisabled,
        hasNextLevel,
        levelControlAriaLabel,
        withNext,
        withPrevious,
        headerControlsOrder,
        ...stylesApiProps
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      Month.Month,
      {
        month,
        locale,
        firstDayOfWeek,
        weekdayFormat,
        weekendDays,
        getDayProps,
        excludeDate,
        minDate,
        maxDate,
        renderDay,
        hideOutsideDates,
        hideWeekdays,
        getDayAriaLabel,
        __getDayRef,
        __onDayKeyDown,
        __onDayClick,
        __onDayMouseEnter,
        __preventFocus,
        __stopPropagation,
        static: isStatic,
        withCellSpacing,
        highlightToday,
        withWeekNumbers,
        ...stylesApiProps
      }
    )
  ] });
});
MonthLevel.classes = { ...Month.Month.classes, ...CalendarHeader.CalendarHeader.classes };
MonthLevel.displayName = "@mantine/dates/MonthLevel";

exports.MonthLevel = MonthLevel;
//# sourceMappingURL=MonthLevel.cjs.map
