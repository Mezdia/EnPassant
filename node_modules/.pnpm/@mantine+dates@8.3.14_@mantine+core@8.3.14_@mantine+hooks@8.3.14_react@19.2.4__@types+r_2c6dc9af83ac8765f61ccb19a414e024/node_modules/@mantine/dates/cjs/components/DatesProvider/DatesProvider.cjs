'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

const DATES_PROVIDER_DEFAULT_SETTINGS = {
  locale: "en",
  firstDayOfWeek: 1,
  weekendDays: [0, 6],
  labelSeparator: "\u2013",
  consistentWeeks: false
};
const DatesProviderContext = react.createContext(DATES_PROVIDER_DEFAULT_SETTINGS);
function DatesProvider({ settings, children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(DatesProviderContext.Provider, { value: { ...DATES_PROVIDER_DEFAULT_SETTINGS, ...settings }, children });
}

exports.DATES_PROVIDER_DEFAULT_SETTINGS = DATES_PROVIDER_DEFAULT_SETTINGS;
exports.DatesProvider = DatesProvider;
exports.DatesProviderContext = DatesProviderContext;
//# sourceMappingURL=DatesProvider.cjs.map
