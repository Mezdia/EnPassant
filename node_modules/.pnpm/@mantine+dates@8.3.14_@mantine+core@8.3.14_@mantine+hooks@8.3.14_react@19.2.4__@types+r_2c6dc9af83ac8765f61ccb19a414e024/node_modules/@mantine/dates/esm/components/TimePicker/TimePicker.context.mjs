'use client';
import { createSafeContext } from '@mantine/core';

const [TimePickerProvider, useTimePickerContext] = createSafeContext(
  "TimeInput component was not found in the component tree"
);

export { TimePickerProvider, useTimePickerContext };
//# sourceMappingURL=TimePicker.context.mjs.map
