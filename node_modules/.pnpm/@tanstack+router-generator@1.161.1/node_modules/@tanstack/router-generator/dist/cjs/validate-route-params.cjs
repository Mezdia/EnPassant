"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const VALID_PARAM_NAME_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
function extractParamsFromSegment(segment) {
  const params = [];
  if (!segment || !segment.includes("$")) {
    return params;
  }
  if (segment === "$" || segment === "{$}") {
    return params;
  }
  if (segment.startsWith("$") && !segment.includes("{")) {
    const paramName = segment.slice(1);
    if (paramName) {
      params.push({
        paramName,
        isValid: VALID_PARAM_NAME_REGEX.test(paramName)
      });
    }
    return params;
  }
  const bracePattern = /\{(-?\$)([^}]*)\}/g;
  let match;
  while ((match = bracePattern.exec(segment)) !== null) {
    const paramName = match[2];
    if (!paramName) {
      continue;
    }
    params.push({
      paramName,
      isValid: VALID_PARAM_NAME_REGEX.test(paramName)
    });
  }
  return params;
}
function extractParamsFromPath(path) {
  if (!path || !path.includes("$")) {
    return [];
  }
  const segments = path.split("/");
  const allParams = [];
  for (const segment of segments) {
    const params = extractParamsFromSegment(segment);
    allParams.push(...params);
  }
  return allParams;
}
function validateRouteParams(routePath, filePath, logger) {
  const params = extractParamsFromPath(routePath);
  const invalidParams = params.filter((p) => !p.isValid);
  for (const param of invalidParams) {
    logger.warn(
      `WARNING: Invalid param name "${param.paramName}" in route "${routePath}" (file: ${filePath}). Param names must be valid JavaScript identifiers (match /[a-zA-Z_$][a-zA-Z0-9_$]*/).`
    );
  }
}
exports.validateRouteParams = validateRouteParams;
//# sourceMappingURL=validate-route-params.cjs.map
