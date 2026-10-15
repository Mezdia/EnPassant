'use client';
import { useContext, useCallback } from 'react';
import { DatesProviderContext } from './DatesProvider.mjs';

function useDatesContext() {
  const ctx = useContext(DatesProviderContext);
  const getLocale = useCallback((input) => input || ctx.locale, [ctx.locale]);
  const getFirstDayOfWeek = useCallback(
    (input) => typeof input === "number" ? input : ctx.firstDayOfWeek,
    [ctx.firstDayOfWeek]
  );
  const getWeekendDays = useCallback(
    (input) => Array.isArray(input) ? input : ctx.weekendDays,
    [ctx.weekendDays]
  );
  const getLabelSeparator = useCallback(
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

export { useDatesContext };
//# sourceMappingURL=use-dates-context.mjs.map
