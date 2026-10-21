'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

const Form = react.forwardRef(
  ({ form, onSubmit, onReset, ...others }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "form",
    {
      ...others,
      onSubmit: form.onSubmit(typeof onSubmit === "function" ? onSubmit : () => {
      }),
      onReset: (event) => {
        onReset?.(event);
        form.onReset(event);
      },
      ref
    }
  )
);
Form.displayName = "@mantine/use-form/Form";

exports.Form = Form;
//# sourceMappingURL=Form.cjs.map
