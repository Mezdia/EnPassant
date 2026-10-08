'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { factory, useProps, Box } from '@mantine/core';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { Month } from '../Month/Month.mjs';

const defaultProps = {
  monthLabelFormat: "MMMM YYYY"
};
const MonthLevel = factory((_props, ref) => {
  const props = useProps("MonthLevel", defaultProps, _props);
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
  const ctx = useDatesContext();
  const stylesApiProps = {
    __staticSelector: __staticSelector || "MonthLevel",
    classNames,
    styles,
    unstyled,
    size,
    attributes
  };
  const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs(month).endOf("month").isBefore(maxDate) : false;
  const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs(month).startOf("month").isAfter(minDate) : false;
  return /* @__PURE__ */ jsxs(Box, { "data-month-level": true, size, ref, ...others, children: [
    /* @__PURE__ */ jsx(
      CalendarHeader,
      {
        label: typeof monthLabelFormat === "function" ? monthLabelFormat(month) : dayjs(month).locale(locale || ctx.locale).format(monthLabelFormat),
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
    /* @__PURE__ */ jsx(
      Month,
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
MonthLevel.classes = { ...Month.classes, ...CalendarHeader.classes };
MonthLevel.displayName = "@mantine/dates/MonthLevel";

export { MonthLevel };
//# sourceMappingURL=MonthLevel.mjs.map
