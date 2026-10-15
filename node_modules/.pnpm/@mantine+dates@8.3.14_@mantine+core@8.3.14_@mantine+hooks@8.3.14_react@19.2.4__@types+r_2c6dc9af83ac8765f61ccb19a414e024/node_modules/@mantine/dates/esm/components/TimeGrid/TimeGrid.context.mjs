'use client';
import { createSafeContext } from '@mantine/core';

const [TimeGridProvider, useTimeGridContext] = createSafeContext(
  "TimeGridProvider was not found in the component tree"
);

export { TimeGridProvider, useTimeGridContext };
//# sourceMappingURL=TimeGrid.context.mjs.map
