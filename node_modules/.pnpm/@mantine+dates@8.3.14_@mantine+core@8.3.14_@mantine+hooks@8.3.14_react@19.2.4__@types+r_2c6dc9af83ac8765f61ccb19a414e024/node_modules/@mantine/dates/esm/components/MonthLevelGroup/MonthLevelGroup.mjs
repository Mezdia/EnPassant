'use client';
import { jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { factory, useProps } from '@mantine/core';
import { handleControlKeyDown } from '../../utils/handle-control-key-down/handle-control-key-down.mjs';
import { LevelsGroup } from '../LevelsGroup/LevelsGroup.mjs';
import { MonthLevel } from '../MonthLevel/MonthLevel.mjs';

const defaultProps = {
  numberOfColumns: 1
};
const MonthLevelGroup = factory((_props, ref) => {
  const props = useProps("MonthLevelGroup", defaultProps, _props);
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
    __onDayClick,
    __onDayMouseEnter,
    withCellSpacing,
    highlightToday,
    withWeekNumbers,
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
    headerControlsOrder,
    // Other settings
    classNames,
    styles,
    unstyled,
    numberOfColumns,
    levelControlAriaLabel,
    monthLabelFormat,
    __staticSelector,
    __stopPropagation,
    size,
    static: isStatic,
    vars,
    attributes,
    ...others
  } = props;
  const daysRefs = useRef([]);
  const months = Array(numberOfColumns).fill(0).map((_, monthIndex) => {
    const currentMonth = dayjs(month).add(monthIndex, "months").format("YYYY-MM-DD");
    return /* @__PURE__ */ jsx(
      MonthLevel,
      {
        month: currentMonth,
        withNext: monthIndex === numberOfColumns - 1,
        withPrevious: monthIndex === 0,
        monthLabelFormat,
        __stopPropagation,
        __onDayClick,
        __onDayMouseEnter,
        __onDayKeyDown: (event, payload) => handleControlKeyDown({
          levelIndex: monthIndex,
          rowIndex: payload.rowIndex,
          cellIndex: payload.cellIndex,
          event,
          controlsRef: daysRefs
        }),
        __getDayRef: (rowIndex, cellIndex, node) => {
          if (!Array.isArray(daysRefs.current[monthIndex])) {
            daysRefs.current[monthIndex] = [];
          }
          if (!Array.isArray(daysRefs.current[monthIndex][rowIndex])) {
            daysRefs.current[monthIndex][rowIndex] = [];
          }
          daysRefs.current[monthIndex][rowIndex][cellIndex] = node;
        },
        levelControlAriaLabel: typeof levelControlAriaLabel === "function" ? levelControlAriaLabel(currentMonth) : levelControlAriaLabel,
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
        classNames,
        styles,
        unstyled,
        __staticSelector: __staticSelector || "MonthLevelGroup",
        size,
        static: isStatic,
        withCellSpacing,
        highlightToday,
        withWeekNumbers,
        headerControlsOrder,
        attributes
      },
      monthIndex
    );
  });
  return /* @__PURE__ */ jsx(
    LevelsGroup,
    {
      classNames,
      styles,
      __staticSelector: __staticSelector || "MonthLevelGroup",
      ref,
      size,
      attributes,
      ...others,
      children: months
    }
  );
});
MonthLevelGroup.classes = { ...LevelsGroup.classes, ...MonthLevel.classes };
MonthLevelGroup.displayName = "@mantine/dates/MonthLevelGroup";

export { MonthLevelGroup };
//# sourceMappingURL=MonthLevelGroup.mjs.map
