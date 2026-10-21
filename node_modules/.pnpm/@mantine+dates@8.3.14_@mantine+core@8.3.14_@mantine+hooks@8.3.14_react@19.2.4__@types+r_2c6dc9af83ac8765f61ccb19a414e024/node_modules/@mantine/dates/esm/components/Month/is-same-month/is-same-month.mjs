'use client';
import dayjs from 'dayjs';

function isSameMonth(date, comparison) {
  return dayjs(date).format("YYYY-MM") === dayjs(comparison).format("YYYY-MM");
}

export { isSameMonth };
//# sourceMappingURL=is-same-month.mjs.map
