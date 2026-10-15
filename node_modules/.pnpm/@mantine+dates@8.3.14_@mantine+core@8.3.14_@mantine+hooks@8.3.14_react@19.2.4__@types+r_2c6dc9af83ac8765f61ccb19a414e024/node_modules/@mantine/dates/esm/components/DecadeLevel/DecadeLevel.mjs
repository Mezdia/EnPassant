'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { factory, useProps, Box } from '@mantine/core';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { YearsList } from '../YearsList/YearsList.mjs';
import { getDecadeRange } from './get-decade-range/get-decade-range.mjs';

const defaultProps = {
  decadeLabelFormat: "YYYY"
};
const DecadeLevel = factory((_props, ref) => {
  const props = useProps("DecadeLevel", defaultProps, _props);
  const {
    // YearsList settings
    decade,
    locale,
    minDate,
    maxDate,
    yearsListFormat,
    getYearControlProps,
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
    nextDisabled,
    previousDisabled,
    levelControlAriaLabel,
    withNext,
    withPrevious,
    headerControlsOrder,
    // Other props
    decadeLabelFormat,
    classNames,
    styles,
    unstyled,
    __staticSelector,
    __stopPropagation,
    size,
    attributes,
    ...others
  } = props;
  const ctx = useDatesContext();
  const [startOfDecade, endOfDecade] = getDecadeRange(decade);
  const stylesApiProps = {
    __staticSelector: __staticSelector || "DecadeLevel",
    classNames,
    styles,
    unstyled,
    size,
    attributes
  };
  const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs(endOfDecade).endOf("year").isBefore(maxDate) : false;
  const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs(startOfDecade).startOf("year").isAfter(minDate) : false;
  const formatDecade = (date, format) => dayjs(date).locale(locale || ctx.locale).format(format);
  return /* @__PURE__ */ jsxs(Box, { "data-decade-level": true, size, ref, ...others, children: [
    /* @__PURE__ */ jsx(
      CalendarHeader,
      {
        label: typeof decadeLabelFormat === "function" ? decadeLabelFormat(startOfDecade, endOfDecade) : `${formatDecade(startOfDecade, decadeLabelFormat)} \u2013 ${formatDecade(
          endOfDecade,
          decadeLabelFormat
        )}`,
        __preventFocus,
        __stopPropagation,
        nextIcon,
        previousIcon,
        nextLabel,
        previousLabel,
        onNext,
        onPrevious,
        nextDisabled: _nextDisabled,
        previousDisabled: _previousDisabled,
        hasNextLevel: false,
        levelControlAriaLabel,
        withNext,
        withPrevious,
        headerControlsOrder,
        ...stylesApiProps
      }
    ),
    /* @__PURE__ */ jsx(
      YearsList,
      {
        decade,
        locale,
        minDate,
        maxDate,
        yearsListFormat,
        getYearControlProps,
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
DecadeLevel.classes = { ...YearsList.classes, ...CalendarHeader.classes };
DecadeLevel.displayName = "@mantine/dates/DecadeLevel";

export { DecadeLevel };
//# sourceMappingURL=DecadeLevel.mjs.map
