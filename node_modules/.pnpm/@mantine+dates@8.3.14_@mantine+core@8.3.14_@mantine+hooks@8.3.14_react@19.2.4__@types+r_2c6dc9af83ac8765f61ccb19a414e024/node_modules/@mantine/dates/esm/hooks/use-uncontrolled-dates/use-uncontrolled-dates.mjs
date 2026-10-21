'use client';
import { useRef } from 'react';
import { useUncontrolled } from '@mantine/hooks';
import 'dayjs';
import { toDateTimeString, toDateString } from '../../utils/to-date-string/to-date-string.mjs';

const getEmptyValue = (type) => type === "range" ? [null, null] : type === "multiple" ? [] : null;
const convertDatesValue = (value, withTime) => {
  const converter = withTime ? toDateTimeString : toDateString;
  return Array.isArray(value) ? value.map(converter) : converter(value);
};
function useUncontrolledDates({
  type,
  value,
  defaultValue,
  onChange,
  withTime = false
}) {
  const storedType = useRef(type);
  const [_value, _setValue, controlled] = useUncontrolled({
    value: convertDatesValue(value, withTime),
    defaultValue: convertDatesValue(defaultValue, withTime),
    finalValue: getEmptyValue(type),
    onChange
  });
  let _finalValue = _value;
  if (storedType.current !== type) {
    storedType.current = type;
    if (value === void 0) {
      _finalValue = defaultValue !== void 0 ? defaultValue : getEmptyValue(type);
      _setValue(_finalValue);
    }
  }
  return [_finalValue, _setValue, controlled];
}

export { convertDatesValue, useUncontrolledDates };
//# sourceMappingURL=use-uncontrolled-dates.mjs.map
