'use client';
'use strict';

var dayjs = require('dayjs');
var hooks = require('@mantine/hooks');
require('../../components/DatesProvider/DatesProvider.cjs');
var useDatesContext = require('../../components/DatesProvider/use-dates-context.cjs');
var getFormattedDate = require('../../utils/get-formatted-date/get-formatted-date.cjs');
var useUncontrolledDates = require('../use-uncontrolled-dates/use-uncontrolled-dates.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function useDatesInput({
  type,
  value,
  defaultValue,
  onChange,
  locale,
  format,
  closeOnChange,
  sortDates,
  labelSeparator,
  valueFormatter
}) {
  const ctx = useDatesContext.useDatesContext();
  const [dropdownOpened, dropdownHandlers] = hooks.useDisclosure(false);
  const [_value, _setValue] = useUncontrolledDates.useUncontrolledDates({
    type,
    value,
    defaultValue,
    onChange
  });
  const formattedValue = getFormattedDate.getFormattedDate({
    type,
    date: _value,
    locale: ctx.getLocale(locale),
    format,
    labelSeparator: ctx.getLabelSeparator(labelSeparator),
    formatter: valueFormatter
  });
  const setValue = (val) => {
    if (closeOnChange) {
      if (type === "default") {
        dropdownHandlers.close();
      }
      if (type === "range" && val[0] && val[1]) {
        dropdownHandlers.close();
      }
    }
    if (sortDates && type === "multiple") {
      _setValue([...val].sort((a, b) => dayjs__default.default(a).isAfter(dayjs__default.default(b)) ? 1 : -1));
    } else {
      _setValue(val);
    }
  };
  const onClear = () => setValue(type === "range" ? [null, null] : type === "multiple" ? [] : null);
  const shouldClear = type === "range" ? !!_value[0] : type === "multiple" ? _value.length > 0 : _value !== null;
  return {
    _value,
    setValue,
    onClear,
    shouldClear,
    formattedValue,
    dropdownOpened,
    dropdownHandlers
  };
}

exports.useDatesInput = useDatesInput;
//# sourceMappingURL=use-dates-input.cjs.map
