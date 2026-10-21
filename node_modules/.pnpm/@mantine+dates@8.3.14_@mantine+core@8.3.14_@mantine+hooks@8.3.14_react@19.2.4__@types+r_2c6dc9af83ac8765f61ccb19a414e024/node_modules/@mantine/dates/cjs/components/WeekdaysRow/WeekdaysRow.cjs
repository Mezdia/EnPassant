'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
require('../DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../DatesProvider/use-dates-context.cjs');
var getWeekdaysNames = require('./get-weekdays-names/get-weekdays-names.cjs');
var WeekdaysRow_module = require('./WeekdaysRow.module.css.cjs');

const varsResolver = core.createVarsResolver((_, { size }) => ({
  weekdaysRow: {
    "--wr-fz": core.getFontSize(size),
    "--wr-spacing": core.getSpacing(size)
  }
}));
const WeekdaysRow = core.factory((_props, ref) => {
  const props = core.useProps("WeekdaysRow", null, _props);
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
  const getStyles = core.useStyles({
    name: __staticSelector || "WeekdaysRow",
    classes: WeekdaysRow_module,
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
  const ctx = useDatesContext.useDatesContext();
  const weekdays = getWeekdaysNames.getWeekdayNames({
    locale: ctx.getLocale(locale),
    format: weekdayFormat,
    firstDayOfWeek: ctx.getFirstDayOfWeek(firstDayOfWeek)
  }).map((weekday, index) => /* @__PURE__ */ jsxRuntime.jsx(CellComponent, { ...getStyles("weekday"), children: weekday }, index));
  return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { component: "tr", ref, ...getStyles("weekdaysRow"), ...others, children: [
    withWeekNumbers && /* @__PURE__ */ jsxRuntime.jsx(CellComponent, { ...getStyles("weekday"), children: "#" }),
    weekdays
  ] });
});
WeekdaysRow.classes = WeekdaysRow_module;
WeekdaysRow.displayName = "@mantine/dates/WeekdaysRow";

exports.WeekdaysRow = WeekdaysRow;
//# sourceMappingURL=WeekdaysRow.cjs.map
