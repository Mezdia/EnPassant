'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var react = require('react');
var core = require('@mantine/core');
var handleControlKeyDown = require('../../utils/handle-control-key-down/handle-control-key-down.cjs');
var LevelsGroup = require('../LevelsGroup/LevelsGroup.cjs');
var YearLevel = require('../YearLevel/YearLevel.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  numberOfColumns: 1
};
const YearLevelGroup = core.factory((_props, ref) => {
  const props = core.useProps("YearLevelGroup", defaultProps, _props);
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
  const controlsRef = react.useRef([]);
  const years = Array(numberOfColumns).fill(0).map((_, yearIndex) => {
    const currentYear = dayjs__default.default(year).add(yearIndex, "years").format("YYYY-MM-DD");
    return /* @__PURE__ */ jsxRuntime.jsx(
      YearLevel.YearLevel,
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
        __onControlKeyDown: (event, payload) => handleControlKeyDown.handleControlKeyDown({
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    LevelsGroup.LevelsGroup,
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
YearLevelGroup.classes = { ...YearLevel.YearLevel.classes, ...LevelsGroup.LevelsGroup.classes };
YearLevelGroup.displayName = "@mantine/dates/YearLevelGroup";

exports.YearLevelGroup = YearLevelGroup;
//# sourceMappingURL=YearLevelGroup.cjs.map
