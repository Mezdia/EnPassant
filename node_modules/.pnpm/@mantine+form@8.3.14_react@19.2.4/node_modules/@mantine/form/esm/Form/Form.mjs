'use client';
import { jsx } from 'react/jsx-runtime';
import { forwardRef } from 'react';

const Form = forwardRef(
  ({ form, onSubmit, onReset, ...others }, ref) => /* @__PURE__ */ jsx(
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

export { Form };
//# sourceMappingURL=Form.mjs.map
