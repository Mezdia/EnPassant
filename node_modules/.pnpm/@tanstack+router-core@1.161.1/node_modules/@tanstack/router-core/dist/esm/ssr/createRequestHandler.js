import { createMemoryHistory } from "@tanstack/history";
import { mergeHeaders } from "./headers.js";
import { attachRouterServerSsrUtils, getNormalizedURL, getOrigin } from "./ssr-server.js";
function createRequestHandler({
  createRouter,
  request,
  getRouterManifest
}) {
  return async (cb) => {
    const router = createRouter();
    let cbWillCleanup = false;
    try {
      attachRouterServerSsrUtils({
        router,
        manifest: await getRouterManifest?.()
      });
      const { url } = getNormalizedURL(request.url, "http://localhost");
      const origin = getOrigin(request);
      const href = url.href.replace(url.origin, "");
      const history = createMemoryHistory({
        initialEntries: [href]
      });
      router.update({
        history,
        origin: router.options.origin ?? origin
      });
      await router.load();
      await router.serverSsr?.dehydrate();
      const responseHeaders = getRequestHeaders({
        router
      });
      cbWillCleanup = true;
      return cb({
        request,
        router,
        responseHeaders
      });
    } finally {
      if (!cbWillCleanup) {
        router.serverSsr?.cleanup();
      }
    }
  };
}
function getRequestHeaders(opts) {
  const matchHeaders = opts.router.state.matches.map(
    (match) => match.headers
  );
  const { redirect } = opts.router.state;
  if (redirect) {
    matchHeaders.push(redirect.headers);
  }
  return mergeHeaders(
    {
      "Content-Type": "text/html; charset=UTF-8"
    },
    ...matchHeaders
  );
}
export {
  createRequestHandler
};
//# sourceMappingURL=createRequestHandler.js.map
