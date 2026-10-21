'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { factory, useProps, Box } from '@mantine/core';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { MonthsList } from '../MonthsList/MonthsList.mjs';

const defaultProps = {
  yearLabelFormat: "YYYY"
};
const YearLevel = factory((_props, ref) => {
  const props = useProps("YearLevel", defaultProps, _props);
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
  const ctx = useDatesContext();
  const stylesApiProps = {
    __staticSelector: __staticSelector || "YearLevel",
    classNames,
    styles,
    unstyled,
    size,
    attributes
  };
  const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs(year).endOf("year").isBefore(maxDate) : false;
  const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs(year).startOf("year").isAfter(minDate) : false;
  return /* @__PURE__ */ jsxs(Box, { "data-year-level": true, size, ref, ...others, children: [
    /* @__PURE__ */ jsx(
      CalendarHeader,
      {
        label: typeof yearLabelFormat === "function" ? yearLabelFormat(year) : dayjs(year).locale(locale || ctx.locale).format(yearLabelFormat),
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
      MonthsList,
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
YearLevel.classes = { ...CalendarHeader.classes, ...MonthsList.classes };
YearLevel.displayName = "@mantine/dates/YearLevel";

export { YearLevel };
//# sourceMappingURL=YearLevel.mjs.map
