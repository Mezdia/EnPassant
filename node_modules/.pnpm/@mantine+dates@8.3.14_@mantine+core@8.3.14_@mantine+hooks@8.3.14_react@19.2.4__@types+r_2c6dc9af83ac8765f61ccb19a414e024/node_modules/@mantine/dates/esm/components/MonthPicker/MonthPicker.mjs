'use client';
import { jsx } from 'react/jsx-runtime';
import { factory, useProps, useResolvedStylesApi } from '@mantine/core';
import { useDatesState } from '../../hooks/use-dates-state/use-dates-state.mjs';
import 'dayjs';
import '@mantine/hooks';
import '../DatesProvider/DatesProvider.mjs';
import 'react';
import { Calendar } from '../Calendar/Calendar.mjs';

const defaultProps = {
  type: "default"
};
const MonthPicker = factory((_props, ref) => {
  const props = useProps("MonthPicker", defaultProps, _props);
  const {
    classNames,
    styles,
    vars,
    type,
    defaultValue,
    value,
    onChange,
    __staticSelector,
    getMonthControlProps,
    allowSingleDateInRange,
    allowDeselect,
    onMouseLeave,
    onMonthSelect,
    __updateDateOnMonthSelect,
    onLevelChange,
    ...others
  } = props;
  const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState({
    type,
    level: "month",
    allowDeselect,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange,
    onMouseLeave
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  return /* @__PURE__ */ jsx(
    Calendar,
    {
      ref,
      minLevel: "year",
      __updateDateOnMonthSelect: __updateDateOnMonthSelect ?? false,
      __staticSelector: __staticSelector || "MonthPicker",
      onMouseLeave: onRootMouseLeave,
      onMonthMouseEnter: (_event, date) => onHoveredDateChange(date),
      onMonthSelect: (date) => {
        onDateChange(date);
        onMonthSelect?.(date);
      },
      getMonthControlProps: (date) => ({
        ...getControlProps(date),
        ...getMonthControlProps?.(date)
      }),
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      onLevelChange,
      ...others
    }
  );
});
MonthPicker.classes = Calendar.classes;
MonthPicker.displayName = "@mantine/dates/MonthPicker";

export { MonthPicker };
//# sourceMappingURL=MonthPicker.mjs.map
