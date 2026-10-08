'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var CalendarHeader = require('../CalendarHeader/CalendarHeader.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var YearsList = require('../YearsList/YearsList.cjs');
var getDecadeRange = require('./get-decade-range/get-decade-range.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  decadeLabelFormat: "YYYY"
};
const DecadeLevel = core.factory((_props, ref) => {
  const props = core.useProps("DecadeLevel", defaultProps, _props);
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
  const ctx = useDatesContext.useDatesContext();
  const [startOfDecade, endOfDecade] = getDecadeRange.getDecadeRange(decade);
  const stylesApiProps = {
    __staticSelector: __staticSelector || "DecadeLevel",
    classNames,
    styles,
    unstyled,
    size,
    attributes
  };
  const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs__default.default(endOfDecade).endOf("year").isBefore(maxDate) : false;
  const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs__default.default(startOfDecade).startOf("year").isAfter(minDate) : false;
  const formatDecade = (date, format) => dayjs__default.default(date).locale(locale || ctx.locale).format(format);
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { "data-decade-level": true, size, ref, ...others, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      CalendarHeader.CalendarHeader,
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
    /* @__PURE__ */ jsxRuntime.jsx(
      YearsList.YearsList,
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
DecadeLevel.classes = { ...YearsList.YearsList.classes, ...CalendarHeader.CalendarHeader.classes };
DecadeLevel.displayName = "@mantine/dates/DecadeLevel";

exports.DecadeLevel = DecadeLevel;
//# sourceMappingURL=DecadeLevel.cjs.map
