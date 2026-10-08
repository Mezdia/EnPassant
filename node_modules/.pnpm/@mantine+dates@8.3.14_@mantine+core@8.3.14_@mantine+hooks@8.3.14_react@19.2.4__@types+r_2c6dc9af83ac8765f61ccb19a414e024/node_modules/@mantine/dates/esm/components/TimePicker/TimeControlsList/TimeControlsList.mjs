'use client';
import { jsx } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@mantine/core';
import { useTimePickerContext } from '../TimePicker.context.mjs';
import { TimeControl } from './TimeControl.mjs';

function isElementVisibleInScrollContainer(element, container) {
  if (!element || !container) {
    return false;
  }
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const isVisible = elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom && elementRect.left >= containerRect.left && elementRect.right <= containerRect.right;
  return isVisible;
}
function getValuesRange(min, max, step) {
  const range = [];
  for (let i = min; i <= max; i += step) {
    range.push(i);
  }
  return range;
}
function TimeControlsList({
  min,
  max,
  step,
  value,
  onSelect,
  reversed
}) {
  const ctx = useTimePickerContext();
  const ref = useRef(null);
  const range = getValuesRange(min, max, step);
  const controls = (reversed ? range.reverse() : range).map((control) => /* @__PURE__ */ jsx(TimeControl, { value: control, active: value === control, onSelect }, control));
  useEffect(() => {
    if (value !== null) {
      const scrollToValue = () => {
        const target = ref.current?.querySelector(`[data-value="${value}"]`);
        if (!isElementVisibleInScrollContainer(target, ref.current)) {
          target?.scrollIntoView({ block: "nearest" });
        }
      };
      requestAnimationFrame(scrollToValue);
    }
  }, [value]);
  return /* @__PURE__ */ jsx(
    ScrollArea,
    {
      h: ctx.maxDropdownContentHeight,
      type: "never",
      viewportRef: ref,
      ...ctx.getStyles("scrollarea"),
      ...ctx.scrollAreaProps,
      children: /* @__PURE__ */ jsx("div", { ...ctx.getStyles("controlsList"), children: controls })
    }
  );
}
TimeControlsList.displayName = "@mantine/dates/TimeControlsList";

export { TimeControlsList };
//# sourceMappingURL=TimeControlsList.mjs.map
