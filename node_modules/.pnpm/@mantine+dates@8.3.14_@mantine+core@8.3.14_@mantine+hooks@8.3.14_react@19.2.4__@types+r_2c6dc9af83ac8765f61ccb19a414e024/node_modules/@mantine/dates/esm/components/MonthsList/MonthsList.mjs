'use client';
import { jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { factory, useProps, useStyles, Box } from '@mantine/core';
import { toDateString } from '../../utils/to-date-string/to-date-string.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { PickerControl } from '../PickerControl/PickerControl.mjs';
import { getMonthInTabOrder } from './get-month-in-tab-order/get-month-in-tab-order.mjs';
import { getMonthsData } from './get-months-data/get-months-data.mjs';
import { isMonthDisabled } from './is-month-disabled/is-month-disabled.mjs';
import classes from './MonthsList.module.css.mjs';

const defaultProps = {
  monthsListFormat: "MMM",
  withCellSpacing: true
};
const MonthsList = factory((_props, ref) => {
  const props = useProps("MonthsList", defaultProps, _props);
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
  const getStyles = useStyles({
    name: __staticSelector || "MonthsList",
    classes,
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
  const ctx = useDatesContext();
  const months = getMonthsData(year);
  const monthInTabOrder = getMonthInTabOrder({
    months,
    minDate: toDateString(minDate),
    maxDate: toDateString(maxDate),
    getMonthControlProps
  });
  const rows = months.map((monthsRow, rowIndex) => {
    const cells = monthsRow.map((month, cellIndex) => {
      const controlProps = getMonthControlProps?.(month);
      const isMonthInTabOrder = dayjs(month).isSame(monthInTabOrder, "month");
      return /* @__PURE__ */ jsx(
        "td",
        {
          ...getStyles("monthsListCell"),
          "data-with-spacing": withCellSpacing || void 0,
          children: /* @__PURE__ */ jsx(
            PickerControl,
            {
              ...getStyles("monthsListControl"),
              size,
              unstyled,
              __staticSelector: __staticSelector || "MonthsList",
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              disabled: isMonthDisabled({
                month,
                minDate: toDateString(minDate),
                maxDate: toDateString(maxDate)
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
              children: controlProps?.children ?? dayjs(month).locale(ctx.getLocale(locale)).format(monthsListFormat)
            }
          )
        },
        cellIndex
      );
    });
    return /* @__PURE__ */ jsx("tr", { ...getStyles("monthsListRow"), children: cells }, rowIndex);
  });
  return /* @__PURE__ */ jsx(Box, { component: "table", ref, size, ...getStyles("monthsList"), ...others, children: /* @__PURE__ */ jsx("tbody", { children: rows }) });
});
MonthsList.classes = classes;
MonthsList.displayName = "@mantine/dates/MonthsList";

export { MonthsList };
//# sourceMappingURL=MonthsList.mjs.map
