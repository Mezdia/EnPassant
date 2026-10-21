'use client';
import { jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { factory, useProps } from '@mantine/core';
import { handleControlKeyDown } from '../../utils/handle-control-key-down/handle-control-key-down.mjs';
import { DecadeLevel } from '../DecadeLevel/DecadeLevel.mjs';
import { LevelsGroup } from '../LevelsGroup/LevelsGroup.mjs';

const defaultProps = {
  numberOfColumns: 1
};
const DecadeLevelGroup = factory((_props, ref) => {
  const props = useProps("DecadeLevelGroup", defaultProps, _props);
  const {
    // DecadeLevel settings
    decade,
    locale,
    minDate,
    maxDate,
    yearsListFormat,
    getYearControlProps,
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
    nextDisabled,
    previousDisabled,
    headerControlsOrder,
    // Other settings
    classNames,
    styles,
    unstyled,
    __staticSelector,
    __stopPropagation,
    numberOfColumns,
    levelControlAriaLabel,
    decadeLabelFormat,
    size,
    vars,
    attributes,
    ...others
  } = props;
  const controlsRef = useRef([]);
  const decades = Array(numberOfColumns).fill(0).map((_, decadeIndex) => {
    const currentDecade = dayjs(decade).add(decadeIndex * 10, "years").format("YYYY-MM-DD");
    return /* @__PURE__ */ jsx(
      DecadeLevel,
      {
        size,
        yearsListFormat,
        decade: currentDecade,
        withNext: decadeIndex === numberOfColumns - 1,
        withPrevious: decadeIndex === 0,
        decadeLabelFormat,
        __onControlClick,
        __onControlMouseEnter,
        __onControlKeyDown: (event, payload) => handleControlKeyDown({
          levelIndex: decadeIndex,
          rowIndex: payload.rowIndex,
          cellIndex: payload.cellIndex,
          event,
          controlsRef
        }),
        __getControlRef: (rowIndex, cellIndex, node) => {
          if (!Array.isArray(controlsRef.current[decadeIndex])) {
            controlsRef.current[decadeIndex] = [];
          }
          if (!Array.isArray(controlsRef.current[decadeIndex][rowIndex])) {
            controlsRef.current[decadeIndex][rowIndex] = [];
          }
          controlsRef.current[decadeIndex][rowIndex][cellIndex] = node;
        },
        levelControlAriaLabel: typeof levelControlAriaLabel === "function" ? levelControlAriaLabel(currentDecade) : levelControlAriaLabel,
        locale,
        minDate,
        maxDate,
        __preventFocus,
        __stopPropagation,
        nextIcon,
        previousIcon,
        nextLabel,
        previousLabel,
        onNext,
        onPrevious,
        nextDisabled,
        previousDisabled,
        getYearControlProps,
        __staticSelector: __staticSelector || "DecadeLevelGroup",
        classNames,
        styles,
        unstyled,
        withCellSpacing,
        headerControlsOrder,
        attributes
      },
      decadeIndex
    );
  });
  return /* @__PURE__ */ jsx(
    LevelsGroup,
    {
      classNames,
      styles,
      __staticSelector: __staticSelector || "DecadeLevelGroup",
      ref,
      size,
      unstyled,
      attributes,
      ...others,
      children: decades
    }
  );
});
DecadeLevelGroup.classes = { ...LevelsGroup.classes, ...DecadeLevel.classes };
DecadeLevelGroup.displayName = "@mantine/dates/DecadeLevelGroup";

export { DecadeLevelGroup };
//# sourceMappingURL=DecadeLevelGroup.mjs.map
