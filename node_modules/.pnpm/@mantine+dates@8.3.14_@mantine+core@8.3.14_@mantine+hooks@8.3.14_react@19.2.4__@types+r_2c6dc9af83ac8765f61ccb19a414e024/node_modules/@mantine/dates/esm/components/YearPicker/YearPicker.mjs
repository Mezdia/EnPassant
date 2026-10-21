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
const YearPicker = factory((_props, ref) => {
  const props = useProps("YearPicker", defaultProps, _props);
  const {
    classNames,
    styles,
    vars,
    type,
    defaultValue,
    value,
    onChange,
    __staticSelector,
    getYearControlProps,
    allowSingleDateInRange,
    allowDeselect,
    onMouseLeave,
    onYearSelect,
    __updateDateOnYearSelect,
    ...others
  } = props;
  const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState({
    type,
    level: "year",
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
      minLevel: "decade",
      __updateDateOnYearSelect: __updateDateOnYearSelect ?? false,
      __staticSelector: __staticSelector || "YearPicker",
      onMouseLeave: onRootMouseLeave,
      onYearMouseEnter: (_event, date) => onHoveredDateChange(date),
      onYearSelect: (date) => {
        onDateChange(date);
        onYearSelect?.(date);
      },
      getYearControlProps: (date) => ({
        ...getControlProps(date),
        ...getYearControlProps?.(date)
      }),
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      ...others
    }
  );
});
YearPicker.classes = Calendar.classes;
YearPicker.displayName = "@mantine/dates/YearPicker";

export { YearPicker };
//# sourceMappingURL=YearPicker.mjs.map
