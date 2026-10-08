'use client';
'use strict';

var react = require('react');
var DatesProvider = require('./DatesProvider.cjs');

function useDatesContext() {
  const ctx = react.useContext(DatesProvider.DatesProviderContext);
  const getLocale = react.useCallback((input) => input || ctx.locale, [ctx.locale]);
  const getFirstDayOfWeek = react.useCallback(
    (input) => typeof input === "number" ? input : ctx.firstDayOfWeek,
    [ctx.firstDayOfWeek]
  );
  const getWeekendDays = react.useCallback(
    (input) => Array.isArray(input) ? input : ctx.weekendDays,
    [ctx.weekendDays]
  );
  const getLabelSeparator = react.useCallback(
    (input) => typeof input === "string" ? input : ctx.labelSeparator,
    [ctx.labelSeparator]
  );
  return {
    ...ctx,
    getLocale,
    getFirstDayOfWeek,
    getWeekendDays,
    getLabelSeparator
  };
}

exports.useDatesContext = useDatesContext;
//# sourceMappingURL=use-dates-context.cjs.map
