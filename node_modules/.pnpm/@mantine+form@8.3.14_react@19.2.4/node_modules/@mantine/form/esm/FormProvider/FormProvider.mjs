'use client';
import { jsx } from 'react/jsx-runtime';
import { createContext, useContext } from 'react';
import { useForm } from '../use-form.mjs';

function createFormContext() {
  const FormContext = createContext(null);
  function FormProvider({ form, children }) {
    return /* @__PURE__ */ jsx(FormContext.Provider, { value: form, children });
  }
  function useFormContext() {
    const ctx = useContext(FormContext);
    if (!ctx) {
      throw new Error("useFormContext was called outside of FormProvider context");
    }
    return ctx;
  }
  return [FormProvider, useFormContext, useForm];
}

export { createFormContext };
//# sourceMappingURL=FormProvider.mjs.map
