'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var toDateString = require('../../utils/to-date-string/to-date-string.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var Day = require('../Day/Day.cjs');
var WeekdaysRow = require('../WeekdaysRow/WeekdaysRow.cjs');
var getDateInTabOrder = require('./get-date-in-tab-order/get-date-in-tab-order.cjs');
var getMonthDays = require('./get-month-days/get-month-days.cjs');
var getWeekNumber = require('./get-week-number/get-week-number.cjs');
var isAfterMinDate = require('./is-after-min-date/is-after-min-date.cjs');
var isBeforeMaxDate = require('./is-before-max-date/is-before-max-date.cjs');
var isSameMonth = require('./is-same-month/is-same-month.cjs');
var Month_module = require('./Month.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  withCellSpacing: true
};
const varsResolver = core.createVarsResolver((_, { size }) => ({
  weekNumber: {
    "--wn-fz": core.getFontSize(size),
    "--wn-size": core.getSize(size, "wn-size")
  }
}));
const Month = core.factory((_props, ref) => {
  const props = core.useProps("Month", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    __staticSelector,
    locale,
    firstDayOfWeek,
    weekdayFormat,
    month,
    weekendDays,
    getDayProps,
    excludeDate,
    minDate,
    maxDate,
    renderDay,
    hideOutsideDates,
    hideWeekdays,
    getDayAriaLabel,
    static: isStatic,
    __getDayRef,
    __onDayKeyDown,
    __onDayClick,
    __onDayMouseEnter,
    __preventFocus,
    __stopPropagation,
    withCellSpacing,
    size,
    highlightToday,
    withWeekNumbers,
    attributes,
    ...others
  } = props;
  const getStyles = core.useStyles({
    name: __staticSelector || "Month",
    classes: Month_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    varsResolver,
    rootSelector: "month"
  });
  const ctx = useDatesContext.useDatesContext();
  const dates = getMonthDays.getMonthDays({
    month,
    firstDayOfWeek: ctx.getFirstDayOfWeek(firstDayOfWeek),
    consistentWeeks: ctx.consistentWeeks
  });
  const dateInTabOrder = getDateInTabOrder.getDateInTabOrder({
    dates,
    minDate: toDateString.toDateString(minDate),
    maxDate: toDateString.toDateString(maxDate),
    getDayProps,
    excludeDate,
    hideOutsideDates,
    month
  });
  const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const rows = dates.map((row, rowIndex) => {
    const cells = row.map((date, cellIndex) => {
      const outside = !isSameMonth.isSameMonth(date, month);
      const ariaLabel = getDayAriaLabel?.(date) || dayjs__default.default(date).locale(locale || ctx.locale).format("D MMMM YYYY");
      const dayProps = getDayProps?.(date);
      const isDateInTabOrder = dayjs__default.default(date).isSame(dateInTabOrder, "date");
      return /* @__PURE__ */ jsxRuntime.jsx(
        "td",
        {
          ...getStyles("monthCell"),
          "data-with-spacing": withCellSpacing || void 0,
          children: /* @__PURE__ */ jsxRuntime.jsx(
            Day.Day,
            {
              __staticSelector: __staticSelector || "Month",
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              unstyled,
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              highlightToday,
              renderDay,
              date,
              size,
              weekend: ctx.getWeekendDays(weekendDays).includes(dayjs__default.default(date).get("day")),
              outside,
              hidden: hideOutsideDates ? outside : false,
              "aria-label": ariaLabel,
              static: isStatic,
              disabled: excludeDate?.(date) || !isBeforeMaxDate.isBeforeMaxDate(date, toDateString.toDateString(maxDate)) || !isAfterMinDate.isAfterMinDate(date, toDateString.toDateString(minDate)),
              ref: (node) => {
                if (node) {
                  __getDayRef?.(rowIndex, cellIndex, node);
                }
              },
              ...dayProps,
              onKeyDown: (event) => {
                dayProps?.onKeyDown?.(event);
                __onDayKeyDown?.(event, { rowIndex, cellIndex, date });
              },
              onMouseEnter: (event) => {
                dayProps?.onMouseEnter?.(event);
                __onDayMouseEnter?.(event, date);
              },
              onClick: (event) => {
                dayProps?.onClick?.(event);
                __onDayClick?.(event, date);
              },
              onMouseDown: (event) => {
                dayProps?.onMouseDown?.(event);
                __preventFocus && event.preventDefault();
              },
              tabIndex: __preventFocus || !isDateInTabOrder ? -1 : 0
            }
          )
        },
        date.toString()
      );
    });
    return /* @__PURE__ */ jsxRuntime.jsxs("tr", { ...getStyles("monthRow"), children: [
      withWeekNumbers && /* @__PURE__ */ jsxRuntime.jsx("td", { ...getStyles("weekNumber"), children: getWeekNumber.getWeekNumber(row) }),
      cells
    ] }, rowIndex);
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { component: "table", ...getStyles("month"), size, ref, ...others, children: [
    !hideWeekdays && /* @__PURE__ */ jsxRuntime.jsx("thead", { ...getStyles("monthThead"), children: /* @__PURE__ */ jsxRuntime.jsx(
      WeekdaysRow.WeekdaysRow,
      {
        __staticSelector: __staticSelector || "Month",
        locale,
        firstDayOfWeek,
        weekdayFormat,
        size,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        unstyled,
        withWeekNumbers
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("tbody", { ...getStyles("monthTbody"), children: rows })
  ] });
});
Month.classes = Month_module;
Month.displayName = "@mantine/dates/Month";

exports.Month = Month;
//# sourceMappingURL=Month.cjs.map
