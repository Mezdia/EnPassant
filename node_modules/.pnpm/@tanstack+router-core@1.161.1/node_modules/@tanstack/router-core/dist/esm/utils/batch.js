import { batch as batch$1 } from "@tanstack/store";
import { isServer } from "@tanstack/router-core/isServer";
function batch(fn) {
  if (isServer) {
    return fn();
  }
  let result;
  batch$1(() => {
    result = fn();
  });
  return result;
}
export {
  batch
};
//# sourceMappingURL=batch.js.map
