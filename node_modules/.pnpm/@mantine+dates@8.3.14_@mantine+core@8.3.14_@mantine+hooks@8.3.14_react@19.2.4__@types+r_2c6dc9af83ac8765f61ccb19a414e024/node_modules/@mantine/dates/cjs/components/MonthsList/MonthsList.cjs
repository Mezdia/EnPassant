'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');
var core = require('@mantine/core');
var toDateString = require('../../utils/to-date-string/to-date-string.cjs');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var PickerControl = require('../PickerControl/PickerControl.cjs');
var getMonthInTabOrder = require('./get-month-in-tab-order/get-month-in-tab-order.cjs');
var getMonthsData = require('./get-months-data/get-months-data.cjs');
var isMonthDisabled = require('./is-month-disabled/is-month-disabled.cjs');
var MonthsList_module = require('./MonthsList.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

const defaultProps = {
  monthsListFormat: "MMM",
  withCellSpacing: true
};
const MonthsList = core.factory((_props, ref) => {
  const props = core.useProps("MonthsList", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    __staticSelector,
    year,
    monthsListFormat,
    locale,
    minDate,
    maxDate,
    getMonthControlProps,
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
    name: __staticSelector || "MonthsList",
    classes: MonthsList_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    rootSelector: "monthsList"
  });
  const ctx = useDatesContext.useDatesContext();
  const months = getMonthsData.getMonthsData(year);
  const monthInTabOrder = getMonthInTabOrder.getMonthInTabOrder({
    months,
    minDate: toDateString.toDateString(minDate),
    maxDate: toDateString.toDateString(maxDate),
    getMonthControlProps
  });
  const rows = months.map((monthsRow, rowIndex) => {
    const cells = monthsRow.map((month, cellIndex) => {
      const controlProps = getMonthControlProps?.(month);
      const isMonthInTabOrder = dayjs__default.default(month).isSame(monthInTabOrder, "month");
      return /* @__PURE__ */ jsxRuntime.jsx(
        "td",
        {
          ...getStyles("monthsListCell"),
          "data-with-spacing": withCellSpacing || void 0,
          children: /* @__PURE__ */ jsxRuntime.jsx(
            PickerControl.PickerControl,
            {
              ...getStyles("monthsListControl"),
              size,
              unstyled,
              __staticSelector: __staticSelector || "MonthsList",
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              disabled: isMonthDisabled.isMonthDisabled({
                month,
                minDate: toDateString.toDateString(minDate),
                maxDate: toDateString.toDateString(maxDate)
              }),
              ref: (node) => {
                if (node) {
                  __getControlRef?.(rowIndex, cellIndex, node);
                }
              },
              ...controlProps,
              onKeyDown: (event) => {
                controlProps?.onKeyDown?.(event);
                __onControlKeyDown?.(event, { rowIndex, cellIndex, date: month });
              },
              onClick: (event) => {
                controlProps?.onClick?.(event);
                __onControlClick?.(event, month);
              },
              onMouseEnter: (event) => {
                controlProps?.onMouseEnter?.(event);
                __onControlMouseEnter?.(event, month);
              },
              onMouseDown: (event) => {
                controlProps?.onMouseDown?.(event);
                __preventFocus && event.preventDefault();
              },
              tabIndex: __preventFocus || !isMonthInTabOrder ? -1 : 0,
              children: controlProps?.children ?? dayjs__default.default(month).locale(ctx.getLocale(locale)).format(monthsListFormat)
            }
          )
        },
        cellIndex
      );
    });
    return /* @__PURE__ */ jsxRuntime.jsx("tr", { ...getStyles("monthsListRow"), children: cells }, rowIndex);
  });
  return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { component: "table", ref, size, ...getStyles("monthsList"), ...others, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: rows }) });
});
MonthsList.classes = MonthsList_module;
MonthsList.displayName = "@mantine/dates/MonthsList";

exports.MonthsList = MonthsList;
//# sourceMappingURL=MonthsList.cjs.map
