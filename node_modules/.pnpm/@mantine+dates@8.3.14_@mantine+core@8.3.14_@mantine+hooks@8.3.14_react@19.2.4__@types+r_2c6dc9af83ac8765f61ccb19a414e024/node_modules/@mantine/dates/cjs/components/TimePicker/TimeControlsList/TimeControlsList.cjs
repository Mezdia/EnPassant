'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var core = require('@mantine/core');
var TimePicker_context = require('../TimePicker.context.cjs');
var TimeControl = require('./TimeControl.cjs');

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
  const ctx = TimePicker_context.useTimePickerContext();
  const ref = react.useRef(null);
  const range = getValuesRange(min, max, step);
  const controls = (reversed ? range.reverse() : range).map((control) => /* @__PURE__ */ jsxRuntime.jsx(TimeControl.TimeControl, { value: control, active: value === control, onSelect }, control));
  react.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    core.ScrollArea,
    {
      h: ctx.maxDropdownContentHeight,
      type: "never",
      viewportRef: ref,
      ...ctx.getStyles("scrollarea"),
      ...ctx.scrollAreaProps,
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { ...ctx.getStyles("controlsList"), children: controls })
    }
  );
}
TimeControlsList.displayName = "@mantine/dates/TimeControlsList";

exports.TimeControlsList = TimeControlsList;
//# sourceMappingURL=TimeControlsList.cjs.map
