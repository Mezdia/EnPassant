'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var useForm = require('../use-form.cjs');

function createFormContext() {
  const FormContext = react.createContext(null);
  function FormProvider({ form, children }) {
    return /* @__PURE__ */ jsxRuntime.jsx(FormContext.Provider, { value: form, children });
  }
  function useFormContext() {
    const ctx = react.useContext(FormContext);
    if (!ctx) {
      throw new Error("useFormContext was called outside of FormProvider context");
    }
    return ctx;
  }
  return [FormProvider, useFormContext, useForm.useForm];
}

exports.createFormContext = createFormContext;
//# sourceMappingURL=FormProvider.cjs.map
