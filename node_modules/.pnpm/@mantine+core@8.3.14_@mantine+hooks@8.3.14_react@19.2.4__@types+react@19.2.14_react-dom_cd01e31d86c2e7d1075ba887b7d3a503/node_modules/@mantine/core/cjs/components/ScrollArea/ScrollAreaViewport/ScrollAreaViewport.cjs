'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var hooks = require('@mantine/hooks');
require('../../../core/utils/units-converters/rem.cjs');
require('clsx');
require('../../../core/MantineProvider/Mantine.context.cjs');
require('../../../core/MantineProvider/default-theme.cjs');
require('../../../core/MantineProvider/MantineProvider.cjs');
require('../../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
require('../../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
var Box = require('../../../core/Box/Box.cjs');
require('../../../core/DirectionProvider/DirectionProvider.cjs');
var ScrollArea_context = require('../ScrollArea.context.cjs');

const ScrollAreaViewport = React.forwardRef(
  ({ children, style, onWheel, ...others }, ref) => {
    const ctx = ScrollArea_context.useScrollAreaContext();
    const rootRef = hooks.useMergedRef(ref, ctx.onViewportChange);
    const handleWheel = (event) => {
      onWheel?.(event);
      if (ctx.scrollbarXEnabled && ctx.viewport && event.shiftKey) {
        const { scrollTop, scrollHeight, clientHeight, scrollWidth, clientWidth } = ctx.viewport;
        const isAtTop = scrollTop < 1;
        const isAtBottom = scrollTop >= scrollHeight - clientHeight - 1;
        const canScrollHorizontally = scrollWidth > clientWidth;
        if (canScrollHorizontally && (isAtTop || isAtBottom)) {
          event.stopPropagation();
        }
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsx(
      Box.Box,
      {
        ...others,
        ref: rootRef,
        onWheel: handleWheel,
        style: {
          overflowX: ctx.scrollbarXEnabled ? "scroll" : "hidden",
          overflowY: ctx.scrollbarYEnabled ? "scroll" : "hidden",
          ...style
        },
        children: /* @__PURE__ */ jsxRuntime.jsx("div", { ...ctx.getStyles("content"), ref: ctx.onContentChange, children })
      }
    );
  }
);
ScrollAreaViewport.displayName = "@mantine/core/ScrollAreaViewport";

exports.ScrollAreaViewport = ScrollAreaViewport;
//# sourceMappingURL=ScrollAreaViewport.cjs.map
