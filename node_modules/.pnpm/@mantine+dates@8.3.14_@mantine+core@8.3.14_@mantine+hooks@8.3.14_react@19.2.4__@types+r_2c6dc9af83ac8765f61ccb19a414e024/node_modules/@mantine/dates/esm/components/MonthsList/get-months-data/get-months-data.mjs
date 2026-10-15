'use client';
import dayjs from 'dayjs';

function getMonthsData(year) {
  const startOfYear = dayjs(year).startOf("year").toDate();
  const results = [[], [], [], []];
  let currentMonthIndex = 0;
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      results[i].push(dayjs(startOfYear).add(currentMonthIndex, "months").format("YYYY-MM-DD"));
      currentMonthIndex += 1;
    }
  }
  return results;
}

export { getMonthsData };
//# sourceMappingURL=get-months-data.mjs.map
