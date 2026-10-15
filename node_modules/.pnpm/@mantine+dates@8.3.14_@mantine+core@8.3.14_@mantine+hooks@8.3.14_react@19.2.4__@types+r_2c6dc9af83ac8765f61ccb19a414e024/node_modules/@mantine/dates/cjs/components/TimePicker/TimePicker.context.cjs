'use client';
'use strict';

var core = require('@mantine/core');

const [TimePickerProvider, useTimePickerContext] = core.createSafeContext(
  "TimeInput component was not found in the component tree"
);

exports.TimePickerProvider = TimePickerProvider;
exports.useTimePickerContext = useTimePickerContext;
//# sourceMappingURL=TimePicker.context.cjs.map
