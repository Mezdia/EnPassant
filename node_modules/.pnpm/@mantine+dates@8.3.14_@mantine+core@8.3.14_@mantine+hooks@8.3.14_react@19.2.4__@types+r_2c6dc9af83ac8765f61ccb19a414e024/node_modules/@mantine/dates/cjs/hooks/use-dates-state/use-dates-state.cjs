'use client';
'use strict';

var dayjs = require('dayjs');
var react = require('react');
var useUncontrolledDates = require('../use-uncontrolled-dates/use-uncontrolled-dates.cjs');
var isInRange = require('./is-in-range/is-in-range.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function useDatesState({
  type,
  level,
  value,
  defaultValue,
  onChange,
  allowSingleDateInRange,
  allowDeselect,
  onMouseLeave
}) {
  const [_value, setValue] = useUncontrolledDates.useUncontrolledDates({
    type,
    value,
    defaultValue,
    onChange
  });
  const [pickedDate, setPickedDate] = react.useState(
    type === "range" ? _value[0] && !_value[1] ? _value[0] : null : null
  );
  const [hoveredDate, setHoveredDate] = react.useState(null);
  const onDateChange = (date) => {
    if (type === "range") {
      if (pickedDate && !_value[1]) {
        if (dayjs__default.default(date).isSame(pickedDate, level) && !allowSingleDateInRange) {
          setPickedDate(null);
          setHoveredDate(null);
          setValue([null, null]);
          return;
        }
        const result = [date, pickedDate];
        result.sort((a, b) => dayjs__default.default(a).isAfter(dayjs__default.default(b)) ? 1 : -1);
        setValue(result);
        setHoveredDate(null);
        setPickedDate(null);
        return;
      }
      if (_value[0] && !_value[1] && dayjs__default.default(date).isSame(_value[0], level) && !allowSingleDateInRange) {
        setPickedDate(null);
        setHoveredDate(null);
        setValue([null, null]);
        return;
      }
      setValue([date, null]);
      setHoveredDate(null);
      setPickedDate(date);
      return;
    }
    if (type === "multiple") {
      if (_value.some((selected) => dayjs__default.default(selected).isSame(date, level))) {
        setValue(_value.filter((selected) => !dayjs__default.default(selected).isSame(date, level)));
      } else {
        setValue([..._value, date]);
      }
      return;
    }
    if (_value && allowDeselect && dayjs__default.default(date).isSame(_value, level)) {
      setValue(null);
    } else {
      setValue(date);
    }
  };
  const isDateInRange = (date) => {
    if (pickedDate && hoveredDate) {
      return isInRange.isInRange(date, [hoveredDate, pickedDate]);
    }
    if (_value[0] && _value[1]) {
      return isInRange.isInRange(date, _value);
    }
    return false;
  };
  const onRootMouseLeave = type === "range" ? (event) => {
    onMouseLeave?.(event);
    setHoveredDate(null);
  } : onMouseLeave;
  const isFirstInRange = (date) => {
    if (!_value[0]) {
      return false;
    }
    if (dayjs__default.default(date).isSame(_value[0], level)) {
      return !(hoveredDate && dayjs__default.default(hoveredDate).isBefore(_value[0]));
    }
    return false;
  };
  const isLastInRange = (date) => {
    if (_value[1]) {
      return dayjs__default.default(date).isSame(_value[1], level);
    }
    if (!_value[0] || !hoveredDate) {
      return false;
    }
    return dayjs__default.default(hoveredDate).isBefore(_value[0]) && dayjs__default.default(date).isSame(_value[0], level);
  };
  const getControlProps = (date) => {
    if (type === "range") {
      return {
        selected: _value.some(
          (selection) => selection && dayjs__default.default(selection).isSame(date, level)
        ),
        inRange: isDateInRange(date),
        firstInRange: isFirstInRange(date),
        lastInRange: isLastInRange(date),
        "data-autofocus": !!_value[0] && dayjs__default.default(_value[0]).isSame(date, level) || void 0
      };
    }
    if (type === "multiple") {
      return {
        selected: _value.some(
          (selection) => selection && dayjs__default.default(selection).isSame(date, level)
        ),
        "data-autofocus": !!_value[0] && dayjs__default.default(_value[0]).isSame(date, level) || void 0
      };
    }
    const selected = dayjs__default.default(_value).isSame(date, level);
    return { selected, "data-autofocus": selected || void 0 };
  };
  const onHoveredDateChange = type === "range" && pickedDate ? setHoveredDate : () => {
  };
  react.useEffect(() => {
    if (type !== "range") {
      return;
    }
    if (_value[0] && !_value[1]) {
      setPickedDate(_value[0]);
    } else {
      const isNeitherSelected = _value[0] == null && _value[1] == null;
      const isBothSelected = _value[0] != null && _value[1] != null;
      if (isNeitherSelected || isBothSelected) {
        setPickedDate(null);
        setHoveredDate(null);
      }
    }
  }, [_value]);
  return {
    onDateChange,
    onRootMouseLeave,
    onHoveredDateChange,
    getControlProps,
    _value,
    setValue
  };
}

exports.useDatesState = useDatesState;
//# sourceMappingURL=use-dates-state.cjs.map
