'use client';
import { jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { factory, useProps, useStyles, Box } from '@mantine/core';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { PickerControl } from '../PickerControl/PickerControl.mjs';
import { getYearInTabOrder } from './get-year-in-tab-order/get-year-in-tab-order.mjs';
import { getYearsData } from './get-years-data/get-years-data.mjs';
import { isYearDisabled } from './is-year-disabled/is-year-disabled.mjs';
import classes from './YearsList.module.css.mjs';

const defaultProps = {
  yearsListFormat: "YYYY",
  withCellSpacing: true
};
const YearsList = factory((_props, ref) => {
  const props = useProps("YearsList", defaultProps, _props);
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
  const getStyles = useStyles({
    name: __staticSelector || "YearsList",
    classes,
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
  const ctx = useDatesContext();
  const years = getYearsData(decade);
  const yearInTabOrder = getYearInTabOrder({
    years,
    minDate,
    maxDate,
    getYearControlProps
  });
  const rows = years.map((yearsRow, rowIndex) => {
    const cells = yearsRow.map((year, cellIndex) => {
      const controlProps = getYearControlProps?.(year);
      const isYearInTabOrder = dayjs(year).isSame(yearInTabOrder, "year");
      return /* @__PURE__ */ jsx(
        "td",
        {
          ...getStyles("yearsListCell"),
          "data-with-spacing": withCellSpacing || void 0,
          children: /* @__PURE__ */ jsx(
            PickerControl,
            {
              ...getStyles("yearsListControl"),
              size,
              unstyled,
              "data-mantine-stop-propagation": __stopPropagation || void 0,
              disabled: isYearDisabled({ year, minDate, maxDate }),
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
              children: controlProps?.children ?? dayjs(year).locale(ctx.getLocale(locale)).format(yearsListFormat)
            }
          )
        },
        cellIndex
      );
    });
    return /* @__PURE__ */ jsx("tr", { ...getStyles("yearsListRow"), children: cells }, rowIndex);
  });
  return /* @__PURE__ */ jsx(Box, { component: "table", ref, size, ...getStyles("yearsList"), ...others, children: /* @__PURE__ */ jsx("tbody", { children: rows }) });
});
YearsList.classes = classes;
YearsList.displayName = "@mantine/dates/YearsList";

export { YearsList };
//# sourceMappingURL=YearsList.mjs.map
