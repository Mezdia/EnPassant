'use client';
'use strict';

var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

function dateStringParser(dateString) {
  if (dateString === null) {
    return null;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime()) || !dateString) {
    return null;
  }
  return dayjs__default.default(date).format("YYYY-MM-DD");
}

exports.dateStringParser = dateStringParser;
//# sourceMappingURL=date-string-parser.cjs.map
