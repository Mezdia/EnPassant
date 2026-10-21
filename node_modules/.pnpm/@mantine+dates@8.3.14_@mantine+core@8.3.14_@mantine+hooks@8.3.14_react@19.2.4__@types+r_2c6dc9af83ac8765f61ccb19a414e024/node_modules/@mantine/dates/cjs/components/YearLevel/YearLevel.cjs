'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var CalendarHeader = require('../CalendarHeader/CalendarHeader.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var MonthsList = require('../MonthsList/MonthsList.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  yearLabelFormat: "YYYY"
};
const YearLevel = core.factory((_props, ref) => {
  const props = core.useProps("YearLevel", defaultProps, _props);
  const {
    // MonthsList settings
    year,
    locale,
    minDate,
    maxDate,
    monthsListFormat,
    getMonthControlProps,
    __getControlRef,
    __onControlKeyDown,
    __onControlClick,
    __onControlMouseEnter,
    withCellSpacing,
    // CalendarHeader settings
    __preventFocus,
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
    yearLabelFormat,
    __staticSelector,
    __stopPropagation,
    size,
    classNames,
    styles,
    unstyled,
    attributes,
    ...others
  } = props;
  const ctx = useDatesContext.useDatesContext();
  const stylesApiProps = {
    __staticSelector: __staticSelector || "YearLevel",
    classNames,
    styles,
    unstyled,
    size,
    attributes
  };
  const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs__default.default(year).endOf("year").isBefore(maxDate) : false;
  const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs__default.default(year).startOf("year").isAfter(minDate) : false;
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { "data-year-level": true, size, ref, ...others, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      CalendarHeader.CalendarHeader,
      {
        label: typeof yearLabelFormat === "function" ? yearLabelFormat(year) : dayjs__default.default(year).locale(locale || ctx.locale).format(yearLabelFormat),
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
      MonthsList.MonthsList,
      {
        year,
        locale,
        minDate,
        maxDate,
        monthsListFormat,
        getMonthControlProps,
        __getControlRef,
        __onControlKeyDown,
        __onControlClick,
        __onControlMouseEnter,
        __preventFocus,
        __stopPropagation,
        withCellSpacing,
        ...stylesApiProps
      }
    )
  ] });
});
YearLevel.classes = { ...CalendarHeader.CalendarHeader.classes, ...MonthsList.MonthsList.classes };
YearLevel.displayName = "@mantine/dates/YearLevel";

exports.YearLevel = YearLevel;
//# sourceMappingURL=YearLevel.cjs.map
