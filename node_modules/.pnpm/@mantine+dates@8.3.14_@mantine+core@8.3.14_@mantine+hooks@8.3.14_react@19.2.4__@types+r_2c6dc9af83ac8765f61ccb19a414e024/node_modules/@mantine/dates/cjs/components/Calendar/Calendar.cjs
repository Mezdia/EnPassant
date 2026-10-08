'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var react = require('react');
var core = require('@mantine/core');
var hooks = require('@mantine/hooks');
var useUncontrolledDates = require('../../hooks/use-uncontrolled-dates/use-uncontrolled-dates.cjs');
require('../DatesProvider/DatesProvider.cjs');
var toDateString = require('../../utils/to-date-string/to-date-string.cjs');
var DecadeLevelGroup = require('../DecadeLevelGroup/DecadeLevelGroup.cjs');
var MonthLevelGroup = require('../MonthLevelGroup/MonthLevelGroup.cjs');
var YearLevelGroup = require('../YearLevelGroup/YearLevelGroup.cjs');
var clampLevel = require('./clamp-level/clamp-level.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  maxLevel: "decade",
  minLevel: "month",
  __updateDateOnYearSelect: true,
  __updateDateOnMonthSelect: true,
  enableKeyboardNavigation: true
};
const Calendar = core.factory((_props, ref) => {
  const props = core.useProps("Calendar", defaultProps, _props);
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
  const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const [_level, setLevel] = hooks.useUncontrolled({
    value: level ? clampLevel.clampLevel(level, minLevel, maxLevel) : void 0,
    defaultValue: defaultLevel ? clampLevel.clampLevel(defaultLevel, minLevel, maxLevel) : void 0,
    finalValue: clampLevel.clampLevel(void 0, minLevel, maxLevel),
    onChange: onLevelChange
  });
  const [_date, setDate] = useUncontrolledDates.useUncontrolledDates({
    type: "default",
    value: toDateString.toDateString(date),
    defaultValue: toDateString.toDateString(defaultDate),
    onChange: onDateChange
  });
  react.useImperativeHandle(__setDateRef, () => (date2) => {
    setDate(date2);
  });
  react.useImperativeHandle(__setLevelRef, () => (level2) => {
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
  const fallbackDate = minDate && dayjs__default.default(now).isAfter(minDate) ? minDate : dayjs__default.default(now).format("YYYY-MM-DD");
  const currentDate = _date || fallbackDate;
  const handleNextMonth = () => {
    const nextDate = dayjs__default.default(currentDate).add(_columnsToScroll, "month").format("YYYY-MM-DD");
    onNextMonth?.(nextDate);
    setDate(nextDate);
  };
  const handlePreviousMonth = () => {
    const nextDate = dayjs__default.default(currentDate).subtract(_columnsToScroll, "month").format("YYYY-MM-DD");
    onPreviousMonth?.(nextDate);
    setDate(nextDate);
  };
  const handleNextYear = () => {
    const nextDate = dayjs__default.default(currentDate).add(_columnsToScroll, "year").format("YYYY-MM-DD");
    onNextYear?.(nextDate);
    setDate(nextDate);
  };
  const handlePreviousYear = () => {
    const nextDate = dayjs__default.default(currentDate).subtract(_columnsToScroll, "year").format("YYYY-MM-DD");
    onPreviousYear?.(nextDate);
    setDate(nextDate);
  };
  const handleNextDecade = () => {
    const nextDate = dayjs__default.default(currentDate).add(10 * _columnsToScroll, "year").format("YYYY-MM-DD");
    onNextDecade?.(nextDate);
    setDate(nextDate);
  };
  const handlePreviousDecade = () => {
    const nextDate = dayjs__default.default(currentDate).subtract(10 * _columnsToScroll, "year").format("YYYY-MM-DD");
    onPreviousDecade?.(nextDate);
    setDate(nextDate);
  };
  const calendarRef = react.useRef(null);
  react.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { ref: mergedRef, size, "data-calendar": true, ...others, children: [
    _level === "month" && /* @__PURE__ */ jsxRuntime.jsx(
      MonthLevelGroup.MonthLevelGroup,
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
    _level === "year" && /* @__PURE__ */ jsxRuntime.jsx(
      YearLevelGroup.YearLevelGroup,
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
          setLevel(clampLevel.clampLevel("month", minLevel, maxLevel));
          onMonthSelect?.(payload);
        },
        __preventFocus,
        __stopPropagation,
        withCellSpacing,
        headerControlsOrder,
        ...stylesApiProps
      }
    ),
    _level === "decade" && /* @__PURE__ */ jsxRuntime.jsx(
      DecadeLevelGroup.DecadeLevelGroup,
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
          setLevel(clampLevel.clampLevel("year", minLevel, maxLevel));
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
  ...DecadeLevelGroup.DecadeLevelGroup.classes,
  ...YearLevelGroup.YearLevelGroup.classes,
  ...MonthLevelGroup.MonthLevelGroup.classes
};
Calendar.displayName = "@mantine/dates/Calendar";

exports.Calendar = Calendar;
//# sourceMappingURL=Calendar.cjs.map
