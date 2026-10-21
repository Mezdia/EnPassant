import { useStore } from "@tanstack/react-store";
import { useRef } from "react";
import { replaceEqualDeep } from "@tanstack/router-core";
import { isServer } from "@tanstack/router-core/isServer";
import { useRouter } from "./useRouter.js";
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: opts?.router === void 0
  });
  const router = opts?.router || contextRouter;
  const _isServer = isServer ?? router.isServer;
  if (_isServer) {
    const state = router.state;
    return opts?.select ? opts.select(state) : state;
  }
  const previousResult = (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRef(void 0)
  );
  return useStore(router.__store, (state) => {
    if (opts?.select) {
      if (opts.structuralSharing ?? router.options.defaultStructuralSharing) {
        const newSlice = replaceEqualDeep(
          previousResult.current,
          opts.select(state)
        );
        previousResult.current = newSlice;
        return newSlice;
      }
      return opts.select(state);
    }
    return state;
  });
}
export {
  useRouterState
};
//# sourceMappingURL=useRouterState.js.map
