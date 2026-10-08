'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useImperativeHandle, useRef, useEffect } from 'react';
import { factory, useProps, useResolvedStylesApi, Box } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { useUncontrolledDates } from '../../hooks/use-uncontrolled-dates/use-uncontrolled-dates.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { toDateString } from '../../utils/to-date-string/to-date-string.mjs';
import { DecadeLevelGroup } from '../DecadeLevelGroup/DecadeLevelGroup.mjs';
import { MonthLevelGroup } from '../MonthLevelGroup/MonthLevelGroup.mjs';
import { YearLevelGroup } from '../YearLevelGroup/YearLevelGroup.mjs';
import { clampLevel } from './clamp-level/clamp-level.mjs';

const defaultProps = {
  maxLevel: "decade",
  minLevel: "month",
  __updateDateOnYearSelect: true,
  __updateDateOnMonthSelect: true,
  enableKeyboardNavigation: true
};
const Calendar = factory((_props, ref) => {
  const props = useProps("Calendar", defaultProps, _props);
  const {
    // CalendarLevel props
    vars,
    maxLevel,
    minLevel,
    defaultLevel,
    level,
    onLevelChange,
    date,
    defaultDate,
    onDateChange,
    numberOfColumns,
    columnsToScroll,
    ariaLabels,
    nextLabel,
    previousLabel,
    onYearSelect,
    onMonthSelect,
    onYearMouseEnter,
    onMonthMouseEnter,
    headerControlsOrder,
    __updateDateOnYearSelect,
    __updateDateOnMonthSelect,
    __setDateRef,
    __setLevelRef,
    // MonthLevelGroup props
    firstDayOfWeek,
    weekdayFormat,
    weekendDays,
    getDayProps,
    excludeDate,
    renderDay,
    hideOutsideDates,
    hideWeekdays,
    getDayAriaLabel,
    monthLabelFormat,
    nextIcon,
    previousIcon,
    __onDayClick,
    __onDayMouseEnter,
    withCellSpacing,
    highlightToday,
    withWeekNumbers,
    // YearLevelGroup props
    monthsListFormat,
    getMonthControlProps,
    yearLabelFormat,
    // DecadeLevelGroup props
    yearsListFormat,
    getYearControlProps,
    decadeLabelFormat,
    // Other props
    classNames,
    styles,
    unstyled,
    minDate,
    maxDate,
    locale,
    __staticSelector,
    size,
    __preventFocus,
    __stopPropagation,
    onNextDecade,
    onPreviousDecade,
    onNextYear,
    onPreviousYear,
    onNextMonth,
    onPreviousMonth,
    static: isStatic,
    enableKeyboardNavigation,
    attributes,
    ...others
  } = props;
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const [_level, setLevel] = useUncontrolled({
    value: level ? clampLevel(level, minLevel, maxLevel) : void 0,
    defaultValue: defaultLevel ? clampLevel(defaultLevel, minLevel, maxLevel) : void 0,
    finalValue: clampLevel(void 0, minLevel, maxLevel),
    onChange: onLevelChange
  });
  const [_date, setDate] = useUncontrolledDates({
    type: "default",
    value: toDateString(date),
    defaultValue: toDateString(defaultDate),
    onChange: onDateChange
  });
  useImperativeHandle(__setDateRef, () => (date2) => {
    setDate(date2);
  });
  useImperativeHandle(__setLevelRef, () => (level2) => {
    setLevel(level2);
  });
  const stylesApiProps = {
    __staticSelector: __staticSelector || "Calendar",
    styles: resolvedStyles,
    classNames: resolvedClassNames,
    unstyled,
    size,
    attributes
  };
  const _columnsToScroll = columnsToScroll || numberOfColumns || 1;
  const now = /* @__PURE__ */ new Date();
  const fallbackDate = minDate && dayjs(now).isAfter(minDate) ? minDate : dayjs(now).format("YYYY-MM-DD");
  const currentDate = _date || fallbackDate;
  const handleNextMonth = () => {
    const nextDate = dayjs(currentDate).add(_columnsToScroll, "month").format("YYYY-MM-DD");
    onNextMonth?.(nextDate);
    setDate(nextDate);
  };
  const handlePreviousMonth = () => {
    const nextDate = dayjs(currentDate).subtract(_columnsToScroll, "month").format("YYYY-MM-DD");
    onPreviousMonth?.(nextDate);
    setDate(nextDate);
  };
  const handleNextYear = () => {
    const nextDate = dayjs(currentDate).add(_columnsToScroll, "year").format("YYYY-MM-DD");
    onNextYear?.(nextDate);
    setDate(nextDate);
  };
  const handlePreviousYear = () => {
    const nextDate = dayjs(currentDate).subtract(_columnsToScroll, "year").format("YYYY-MM-DD");
    onPreviousYear?.(nextDate);
    setDate(nextDate);
  };
  const handleNextDecade = () => {
    const nextDate = dayjs(currentDate).add(10 * _columnsToScroll, "year").format("YYYY-MM-DD");
    onNextDecade?.(nextDate);
    setDate(nextDate);
  };
  const handlePreviousDecade = () => {
    const nextDate = dayjs(currentDate).subtract(10 * _columnsToScroll, "year").format("YYYY-MM-DD");
    onPreviousDecade?.(nextDate);
    setDate(nextDate);
  };
  const calendarRef = useRef(null);
  useEffect(() => {
    if (!enableKeyboardNavigation || isStatic) {
      return;
    }
    const handleKeyDown = (event) => {
      if (!calendarRef.current?.contains(document.activeElement)) {
        return;
      }
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      switch (event.key) {
        case "ArrowUp":
          if (isCtrlOrCmd && isShift) {
            event.preventDefault();
            handlePreviousDecade();
          } else if (isCtrlOrCmd) {
            event.preventDefault();
            handlePreviousYear();
          }
          break;
        case "ArrowDown":
          if (isCtrlOrCmd && isShift) {
            event.preventDefault();
            handleNextDecade();
          } else if (isCtrlOrCmd) {
            event.preventDefault();
            handleNextYear();
          }
          break;
        case "y":
        case "Y":
          if (_level === "month") {
            event.preventDefault();
            setLevel("year");
          }
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enableKeyboardNavigation,
    isStatic,
    _level,
    handleNextYear,
    handlePreviousYear,
    handleNextDecade,
    handlePreviousDecade
  ]);
  const mergedRef = (node) => {
    calendarRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };
  return /* @__PURE__ */ jsxs(Box, { ref: mergedRef, size, "data-calendar": true, ...others, children: [
    _level === "month" && /* @__PURE__ */ jsx(
      MonthLevelGroup,
      {
        month: currentDate,
        minDate,
        maxDate,
        firstDayOfWeek,
        weekdayFormat,
        weekendDays,
        getDayProps,
        excludeDate,
        renderDay,
        hideOutsideDates,
        hideWeekdays,
        getDayAriaLabel,
        onNext: handleNextMonth,
        onPrevious: handlePreviousMonth,
        hasNextLevel: maxLevel !== "month",
        onLevelClick: () => setLevel("year"),
        numberOfColumns,
        locale,
        levelControlAriaLabel: ariaLabels?.monthLevelControl,
        nextLabel: ariaLabels?.nextMonth ?? nextLabel,
        nextIcon,
        previousLabel: ariaLabels?.previousMonth ?? previousLabel,
        previousIcon,
        monthLabelFormat,
        __onDayClick,
        __onDayMouseEnter,
        __preventFocus,
        __stopPropagation,
        static: isStatic,
        withCellSpacing,
        highlightToday,
        withWeekNumbers,
        headerControlsOrder,
        ...stylesApiProps
      }
    ),
    _level === "year" && /* @__PURE__ */ jsx(
      YearLevelGroup,
      {
        year: currentDate,
        numberOfColumns,
        minDate,
        maxDate,
        monthsListFormat,
        getMonthControlProps,
        locale,
        onNext: handleNextYear,
        onPrevious: handlePreviousYear,
        hasNextLevel: maxLevel !== "month" && maxLevel !== "year",
        onLevelClick: () => setLevel("decade"),
        levelControlAriaLabel: ariaLabels?.yearLevelControl,
        nextLabel: ariaLabels?.nextYear ?? nextLabel,
        nextIcon,
        previousLabel: ariaLabels?.previousYear ?? previousLabel,
        previousIcon,
        yearLabelFormat,
        __onControlMouseEnter: onMonthMouseEnter,
        __onControlClick: (_event, payload) => {
          __updateDateOnMonthSelect && setDate(payload);
          setLevel(clampLevel("month", minLevel, maxLevel));
          onMonthSelect?.(payload);
        },
        __preventFocus,
        __stopPropagation,
        withCellSpacing,
        headerControlsOrder,
        ...stylesApiProps
      }
    ),
    _level === "decade" && /* @__PURE__ */ jsx(
      DecadeLevelGroup,
      {
        decade: currentDate,
        minDate,
        maxDate,
        yearsListFormat,
        getYearControlProps,
        locale,
        onNext: handleNextDecade,
        onPrevious: handlePreviousDecade,
        numberOfColumns,
        nextLabel: ariaLabels?.nextDecade ?? nextLabel,
        nextIcon,
        previousLabel: ariaLabels?.previousDecade ?? previousLabel,
        previousIcon,
        decadeLabelFormat,
        __onControlMouseEnter: onYearMouseEnter,
        __onControlClick: (_event, payload) => {
          __updateDateOnYearSelect && setDate(payload);
          setLevel(clampLevel("year", minLevel, maxLevel));
          onYearSelect?.(payload);
        },
        __preventFocus,
        __stopPropagation,
        withCellSpacing,
        headerControlsOrder,
        ...stylesApiProps
      }
    )
  ] });
});
Calendar.classes = {
  ...DecadeLevelGroup.classes,
  ...YearLevelGroup.classes,
  ...MonthLevelGroup.classes
};
Calendar.displayName = "@mantine/dates/Calendar";

export { Calendar };
//# sourceMappingURL=Calendar.mjs.map
