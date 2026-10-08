'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var PickerControl = require('../PickerControl/PickerControl.cjs');
var getYearInTabOrder = require('./get-year-in-tab-order/get-year-in-tab-order.cjs');
var getYearsData = require('./get-years-data/get-years-data.cjs');
var isYearDisabled = require('./is-year-disabled/is-year-disabled.cjs');
var YearsList_module = require('./YearsList.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  yearsListFormat: "YYYY",
  withCellSpacing: true
};
const YearsList = core.factory((_props, ref) => {
  const props = core.useProps("YearsList", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    decade,
    yearsListFormat,
    locale,
    minDate,
    maxDate,
    getYearControlProps,
    __staticSelector,
    __getControlRef,
    __onControlKeyDown,
    __onControlClick,
    __onControlMouseEnter,
    __preventFocus,
    __stopPropagation,
    withCellSpacing,
    size,
    attributes,
    ...others
  } = props;
  const getStyles = core.useStyles({
    name: __staticSelector || "YearsList",
    classes: YearsList_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    rootSelector: "yearsList"
  });
  const ctx = useDatesContext.useDatesContext();
  const years = getYearsData.getYearsData(decade);
  const yearInTabOrder = getYearInTabOrder.getYearInTabOrder({
    years,
    minDate,
    maxDate,
    getYearControlProps
  });
  const rows = years.map((yearsRow, rowIndex) => {
    const cells = yearsRow.map((year, cellIndex) => {
      const controlProps = getYearControlProps?.(year);
      const isYearInTabOrder = dayjs__default.default(year).isSame(yearInTabOrder, "year");
      return /* @__PURE__ */ jsxRuntime.jsx(
        "td",
        {
          ...getStyles("yearsListCell"),
          "data-with-spacing": withCellSpacing || void 0,
          children: /* @__PURE__ */ jsxRuntime.jsx(
            PickerControl.PickerControl,
            {
              ...getStyles("yearsListControl"),
              size,
              unstyled,
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              disabled: isYearDisabled.isYearDisabled({ year, minDate, maxDate }),
              ref: (node) => {
                if (node) {
                  __getControlRef?.(rowIndex, cellIndex, node);
                }
              },
              ...controlProps,
              onKeyDown: (event) => {
                controlProps?.onKeyDown?.(event);
                __onControlKeyDown?.(event, { rowIndex, cellIndex, date: year });
              },
              onClick: (event) => {
                controlProps?.onClick?.(event);
                __onControlClick?.(event, year);
              },
              onMouseEnter: (event) => {
                controlProps?.onMouseEnter?.(event);
                __onControlMouseEnter?.(event, year);
              },
              onMouseDown: (event) => {
                controlProps?.onMouseDown?.(event);
                __preventFocus && event.preventDefault();
              },
              tabIndex: __preventFocus || !isYearInTabOrder ? -1 : 0,
              children: controlProps?.children ?? dayjs__default.default(year).locale(ctx.getLocale(locale)).format(yearsListFormat)
            }
          )
        },
        cellIndex
      );
    });
    return /* @__PURE__ */ jsxRuntime.jsx("tr", { ...getStyles("yearsListRow"), children: cells }, rowIndex);
  });
  return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { component: "table", ref, size, ...getStyles("yearsList"), ...others, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: rows }) });
});
YearsList.classes = YearsList_module;
YearsList.displayName = "@mantine/dates/YearsList";

exports.YearsList = YearsList;
//# sourceMappingURL=YearsList.cjs.map
