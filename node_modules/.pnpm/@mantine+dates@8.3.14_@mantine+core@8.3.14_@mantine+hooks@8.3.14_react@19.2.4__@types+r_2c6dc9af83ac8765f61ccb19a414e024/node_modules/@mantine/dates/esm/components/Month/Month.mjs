'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { createVarsResolver, getSize, getFontSize, factory, useProps, useStyles, useResolvedStylesApi, Box } from '@mantine/core';
import { toDateString } from '../../utils/to-date-string/to-date-string.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { Day } from '../Day/Day.mjs';
import { WeekdaysRow } from '../WeekdaysRow/WeekdaysRow.mjs';
import { getDateInTabOrder } from './get-date-in-tab-order/get-date-in-tab-order.mjs';
import { getMonthDays } from './get-month-days/get-month-days.mjs';
import { getWeekNumber } from './get-week-number/get-week-number.mjs';
import { isAfterMinDate } from './is-after-min-date/is-after-min-date.mjs';
import { isBeforeMaxDate } from './is-before-max-date/is-before-max-date.mjs';
import { isSameMonth } from './is-same-month/is-same-month.mjs';
import classes from './Month.module.css.mjs';

const defaultProps = {
  withCellSpacing: true
};
const varsResolver = createVarsResolver((_, { size }) => ({
  weekNumber: {
    "--wn-fz": getFontSize(size),
    "--wn-size": getSize(size, "wn-size")
  }
}));
const Month = factory((_props, ref) => {
  const props = useProps("Month", defaultProps, _props);
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
  const getStyles = useStyles({
    name: __staticSelector || "Month",
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
    rootSelector: "month"
  });
  const ctx = useDatesContext();
  const dates = getMonthDays({
    month,
    firstDayOfWeek: ctx.getFirstDayOfWeek(firstDayOfWeek),
    consistentWeeks: ctx.consistentWeeks
  });
  const dateInTabOrder = getDateInTabOrder({
    dates,
    minDate: toDateString(minDate),
    maxDate: toDateString(maxDate),
    getDayProps,
    excludeDate,
    hideOutsideDates,
    month
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const rows = dates.map((row, rowIndex) => {
    const cells = row.map((date, cellIndex) => {
      const outside = !isSameMonth(date, month);
      const ariaLabel = getDayAriaLabel?.(date) || dayjs(date).locale(locale || ctx.locale).format("D MMMM YYYY");
      const dayProps = getDayProps?.(date);
      const isDateInTabOrder = dayjs(date).isSame(dateInTabOrder, "date");
      return /* @__PURE__ */ jsx(
        "td",
        {
          ...getStyles("monthCell"),
          "data-with-spacing": withCellSpacing || void 0,
          children: /* @__PURE__ */ jsx(
            Day,
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
              weekend: ctx.getWeekendDays(weekendDays).includes(dayjs(date).get("day")),
              outside,
              hidden: hideOutsideDates ? outside : false,
              "aria-label": ariaLabel,
              static: isStatic,
              disabled: excludeDate?.(date) || !isBeforeMaxDate(date, toDateString(maxDate)) || !isAfterMinDate(date, toDateString(minDate)),
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
    return /* @__PURE__ */ jsxs("tr", { ...getStyles("monthRow"), children: [
      withWeekNumbers && /* @__PURE__ */ jsx("td", { ...getStyles("weekNumber"), children: getWeekNumber(row) }),
      cells
    ] }, rowIndex);
  });
  return /* @__PURE__ */ jsxs(Box, { component: "table", ...getStyles("month"), size, ref, ...others, children: [
    !hideWeekdays && /* @__PURE__ */ jsx("thead", { ...getStyles("monthThead"), children: /* @__PURE__ */ jsx(
      WeekdaysRow,
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
    /* @__PURE__ */ jsx("tbody", { ...getStyles("monthTbody"), children: rows })
  ] });
});
Month.classes = classes;
Month.displayName = "@mantine/dates/Month";

export { Month };
//# sourceMappingURL=Month.mjs.map
