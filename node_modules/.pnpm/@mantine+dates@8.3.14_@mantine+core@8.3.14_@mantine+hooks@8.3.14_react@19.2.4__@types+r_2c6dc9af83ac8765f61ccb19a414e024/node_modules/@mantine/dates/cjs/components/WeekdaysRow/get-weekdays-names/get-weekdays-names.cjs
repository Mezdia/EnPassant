'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function getWeekdayNames({
  locale,
  format = "dd",
  firstDayOfWeek = 1
}) {
  const baseDate = dayjs__default.default().day(firstDayOfWeek);
  const labels = [];
  for (let i = 0; i < 7; i += 1) {
    if (typeof format === "string") {
      labels.push(dayjs__default.default(baseDate).add(i, "days").locale(locale).format(format));
    } else {
      labels.push(format(dayjs__default.default(baseDate).add(i, "days").format("YYYY-MM-DD")));
    }
  }
  return labels;
}

exports.getWeekdayNames = getWeekdayNames;
//# sourceMappingURL=get-weekdays-names.cjs.map
