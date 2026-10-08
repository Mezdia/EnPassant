'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@mantine/core');
var LevelsGroup_module = require('./LevelsGroup.module.css.cjs');

const LevelsGroup = core.factory((_props, ref) => {
  const props = core.useProps("LevelsGroup", null, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    __staticSelector,
    attributes,
    ...others
  } = props;
  const getStyles = core.useStyles({
    name: __staticSelector || "LevelsGroup",
    classes: LevelsGroup_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    attributes,
    vars,
    rootSelector: "levelsGroup"
  });
  return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ref, ...getStyles("levelsGroup"), ...others });
});
LevelsGroup.classes = LevelsGroup_module;
LevelsGroup.displayName = "@mantine/dates/LevelsGroup";

exports.LevelsGroup = LevelsGroup;
//# sourceMappingURL=LevelsGroup.cjs.map
