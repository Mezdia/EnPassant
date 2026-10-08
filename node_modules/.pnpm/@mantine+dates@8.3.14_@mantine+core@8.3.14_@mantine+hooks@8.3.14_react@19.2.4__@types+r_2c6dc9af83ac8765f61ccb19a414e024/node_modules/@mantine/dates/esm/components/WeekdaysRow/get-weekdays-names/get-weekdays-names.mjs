'use client';
import dayjs from 'dayjs';

function getWeekdayNames({
  locale,
  format = "dd",
  firstDayOfWeek = 1
}) {
  const baseDate = dayjs().day(firstDayOfWeek);
  const labels = [];
  for (let i = 0; i < 7; i += 1) {
    if (typeof format === "string") {
      labels.push(dayjs(baseDate).add(i, "days").locale(locale).format(format));
    } else {
      labels.push(format(dayjs(baseDate).add(i, "days").format("YYYY-MM-DD")));
    }
  }
  return labels;
}

export { getWeekdayNames };
//# sourceMappingURL=get-weekdays-names.mjs.map
