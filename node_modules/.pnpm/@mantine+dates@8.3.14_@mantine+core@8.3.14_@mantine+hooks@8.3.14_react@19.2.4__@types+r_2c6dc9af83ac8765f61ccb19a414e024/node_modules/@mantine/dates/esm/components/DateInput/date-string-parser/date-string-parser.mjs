'use client';
import dayjs from 'dayjs';

function dateStringParser(dateString) {
  if (dateString === null) {
    return null;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime()) || !dateString) {
    return null;
  }
  return dayjs(date).format("YYYY-MM-DD");
}

export { dateStringParser };
//# sourceMappingURL=date-string-parser.mjs.map
