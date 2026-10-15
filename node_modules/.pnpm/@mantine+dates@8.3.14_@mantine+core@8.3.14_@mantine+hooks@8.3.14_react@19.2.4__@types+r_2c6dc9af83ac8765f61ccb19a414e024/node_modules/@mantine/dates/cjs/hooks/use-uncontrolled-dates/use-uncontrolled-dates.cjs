'use client';
'use strict';

var react = require('react');
var hooks = require('@mantine/hooks');
require('dayjs');
var toDateString = require('../../utils/to-date-string/to-date-string.cjs');

const getEmptyValue = (type) => type === "range" ? [null, null] : type === "multiple" ? [] : null;
const convertDatesValue = (value, withTime) => {
  const converter = withTime ? toDateString.toDateTimeString : toDateString.toDateString;
  return Array.isArray(value) ? value.map(converter) : converter(value);
};
function useUncontrolledDates({
  type,
  value,
  defaultValue,
  onChange,
  withTime = false
}) {
  const storedType = react.useRef(type);
  const [_value, _setValue, controlled] = hooks.useUncontrolled({
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

exports.convertDatesValue = convertDatesValue;
exports.useUncontrolledDates = useUncontrolledDates;
//# sourceMappingURL=use-uncontrolled-dates.cjs.map
