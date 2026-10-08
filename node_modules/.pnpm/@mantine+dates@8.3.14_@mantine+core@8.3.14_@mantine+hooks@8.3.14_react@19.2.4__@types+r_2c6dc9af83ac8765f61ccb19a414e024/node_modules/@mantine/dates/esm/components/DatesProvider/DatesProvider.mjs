'use client';
import { jsx } from 'react/jsx-runtime';
import { createContext } from 'react';

const DATES_PROVIDER_DEFAULT_SETTINGS = {
  locale: "en",
  firstDayOfWeek: 1,
  weekendDays: [0, 6],
  labelSeparator: "\u2013",
  consistentWeeks: false
};
const DatesProviderContext = createContext(DATES_PROVIDER_DEFAULT_SETTINGS);
function DatesProvider({ settings, children }) {
  return /* @__PURE__ */ jsx(DatesProviderContext.Provider, { value: { ...DATES_PROVIDER_DEFAULT_SETTINGS, ...settings }, children });
}

export { DATES_PROVIDER_DEFAULT_SETTINGS, DatesProvider, DatesProviderContext };
//# sourceMappingURL=DatesProvider.mjs.map
