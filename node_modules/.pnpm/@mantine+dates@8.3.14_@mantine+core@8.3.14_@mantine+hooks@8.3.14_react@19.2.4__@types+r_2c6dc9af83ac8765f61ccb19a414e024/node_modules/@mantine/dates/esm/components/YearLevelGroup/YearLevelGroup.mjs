'use client';
import { jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { factory, useProps } from '@mantine/core';
import { handleControlKeyDown } from '../../utils/handle-control-key-down/handle-control-key-down.mjs';
import { LevelsGroup } from '../LevelsGroup/LevelsGroup.mjs';
import { YearLevel } from '../YearLevel/YearLevel.mjs';

const defaultProps = {
  numberOfColumns: 1
};
const YearLevelGroup = factory((_props, ref) => {
  const props = useProps("YearLevelGroup", defaultProps, _props);
  const {
    // YearLevel settings
    year,
    locale,
    minDate,
    maxDate,
    monthsListFormat,
    getMonthControlProps,
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
    headerControlsOrder,
    // Other settings
    classNames,
    styles,
    unstyled,
    __staticSelector,
    __stopPropagation,
    numberOfColumns,
    levelControlAriaLabel,
    yearLabelFormat,
    size,
    vars,
    attributes,
    ...others
  } = props;
  const controlsRef = useRef([]);
  const years = Array(numberOfColumns).fill(0).map((_, yearIndex) => {
    const currentYear = dayjs(year).add(yearIndex, "years").format("YYYY-MM-DD");
    return /* @__PURE__ */ jsx(
      YearLevel,
      {
        size,
        monthsListFormat,
        year: currentYear,
        withNext: yearIndex === numberOfColumns - 1,
        withPrevious: yearIndex === 0,
        yearLabelFormat,
        __stopPropagation,
        __onControlClick,
        __onControlMouseEnter,
        __onControlKeyDown: (event, payload) => handleControlKeyDown({
          levelIndex: yearIndex,
          rowIndex: payload.rowIndex,
          cellIndex: payload.cellIndex,
          event,
          controlsRef
        }),
        __getControlRef: (rowIndex, cellIndex, node) => {
          if (!Array.isArray(controlsRef.current[yearIndex])) {
            controlsRef.current[yearIndex] = [];
          }
          if (!Array.isArray(controlsRef.current[yearIndex][rowIndex])) {
            controlsRef.current[yearIndex][rowIndex] = [];
          }
          controlsRef.current[yearIndex][rowIndex][cellIndex] = node;
        },
        levelControlAriaLabel: typeof levelControlAriaLabel === "function" ? levelControlAriaLabel(currentYear) : levelControlAriaLabel,
        locale,
        minDate,
        maxDate,
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
        getMonthControlProps,
        classNames,
        styles,
        unstyled,
        __staticSelector: __staticSelector || "YearLevelGroup",
        withCellSpacing,
        headerControlsOrder,
        attributes
      },
      yearIndex
    );
  });
  return /* @__PURE__ */ jsx(
    LevelsGroup,
    {
      classNames,
      styles,
      __staticSelector: __staticSelector || "YearLevelGroup",
      ref,
      size,
      unstyled,
      attributes,
      ...others,
      children: years
    }
  );
});
YearLevelGroup.classes = { ...YearLevel.classes, ...LevelsGroup.classes };
YearLevelGroup.displayName = "@mantine/dates/YearLevelGroup";

export { YearLevelGroup };
//# sourceMappingURL=YearLevelGroup.mjs.map
