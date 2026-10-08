'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createVarsResolver, getSpacing, getFontSize, factory, useProps, useStyles, Box } from '@mantine/core';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import { getWeekdayNames } from './get-weekdays-names/get-weekdays-names.mjs';
import classes from './WeekdaysRow.module.css.mjs';

const varsResolver = createVarsResolver((_, { size }) => ({
  weekdaysRow: {
    "--wr-fz": getFontSize(size),
    "--wr-spacing": getSpacing(size)
  }
}));
const WeekdaysRow = factory((_props, ref) => {
  const props = useProps("WeekdaysRow", null, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    locale,
    firstDayOfWeek,
    weekdayFormat,
    cellComponent: CellComponent = "th",
    __staticSelector,
    withWeekNumbers,
    attributes,
    ...others
  } = props;
  const getStyles = useStyles({
    name: __staticSelector || "WeekdaysRow",
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    varsResolver,
    rootSelector: "weekdaysRow"
  });
  const ctx = useDatesContext();
  const weekdays = getWeekdayNames({
    locale: ctx.getLocale(locale),
    format: weekdayFormat,
    firstDayOfWeek: ctx.getFirstDayOfWeek(firstDayOfWeek)
  }).map((weekday, index) => /* @__PURE__ */ jsx(CellComponent, { ...getStyles("weekday"), children: weekday }, index));
  return /* @__PURE__ */ jsxs(Box, { component: "tr", ref, ...getStyles("weekdaysRow"), ...others, children: [
    withWeekNumbers && /* @__PURE__ */ jsx(CellComponent, { ...getStyles("weekday"), children: "#" }),
    weekdays
  ] });
});
WeekdaysRow.classes = classes;
WeekdaysRow.displayName = "@mantine/dates/WeekdaysRow";

export { WeekdaysRow };
//# sourceMappingURL=WeekdaysRow.mjs.map
