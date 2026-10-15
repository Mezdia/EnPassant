import { deepEqual } from "./utils.js";
function retainSearchParams(keys) {
  return ({ search, next }) => {
    const result = next(search);
    if (keys === true) {
      return { ...search, ...result };
    }
    const copy = { ...result };
    keys.forEach((key) => {
      if (!(key in copy)) {
        copy[key] = search[key];
      }
    });
    return copy;
  };
}
function stripSearchParams(input) {
  return ({ search, next }) => {
    if (input === true) {
      return {};
    }
    const result = { ...next(search) };
    if (Array.isArray(input)) {
      input.forEach((key) => {
        delete result[key];
      });
    } else {
      Object.entries(input).forEach(
        ([key, value]) => {
          if (deepEqual(result[key], value)) {
            delete result[key];
          }
        }
      );
    }
    return result;
  };
}
export {
  retainSearchParams,
  stripSearchParams
};
//# sourceMappingURL=searchMiddleware.js.map
