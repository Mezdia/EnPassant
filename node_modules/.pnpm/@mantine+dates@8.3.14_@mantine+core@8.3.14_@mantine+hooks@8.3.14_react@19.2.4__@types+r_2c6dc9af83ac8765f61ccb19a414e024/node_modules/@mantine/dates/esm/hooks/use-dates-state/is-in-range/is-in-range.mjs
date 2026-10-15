'use client';
import dayjs from 'dayjs';

function isInRange(date, range) {
  const _range = [...range].sort((a, b) => dayjs(a).isAfter(dayjs(b)) ? 1 : -1);
  return dayjs(_range[0]).startOf("day").subtract(1, "ms").isBefore(date) && dayjs(_range[1]).endOf("day").add(1, "ms").isAfter(date);
}

export { isInRange };
//# sourceMappingURL=is-in-range.mjs.map
