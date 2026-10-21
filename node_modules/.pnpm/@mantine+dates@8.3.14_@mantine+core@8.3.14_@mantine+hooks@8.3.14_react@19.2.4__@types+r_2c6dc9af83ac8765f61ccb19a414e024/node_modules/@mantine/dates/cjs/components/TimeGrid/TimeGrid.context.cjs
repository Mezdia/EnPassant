'use client';
'use strict';

var core = require('@mantine/core');

const [TimeGridProvider, useTimeGridContext] = core.createSafeContext(
  "TimeGridProvider was not found in the component tree"
);

exports.TimeGridProvider = TimeGridProvider;
exports.useTimeGridContext = useTimeGridContext;
//# sourceMappingURL=TimeGrid.context.cjs.map
