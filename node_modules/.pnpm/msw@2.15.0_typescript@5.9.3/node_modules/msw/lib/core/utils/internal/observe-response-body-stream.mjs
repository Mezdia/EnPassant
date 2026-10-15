import { DeferredPromise } from "@open-draft/deferred-promise";
import { FetchResponse } from "@mswjs/interceptors";
import { copyResponseOwnProperties } from '../HttpResponse/decorators.mjs';
function observeResponseBodyStream(response) {
  if (response.body == null || response.bodyUsed || response.body.locked) {
    return null;
  }
  const settled = new DeferredPromise();
  const reader = response.body.getReader();
  const observedStream = new ReadableStream({
    async pull(controller) {
      try {
        const readResult = await reader.read();
        if (readResult.done) {
          settled.resolve();
          controller.close();
          return;
        }
        controller.enqueue(readResult.value);
      } catch (error) {
        settled.resolve();
        throw error;
      }
    },
    async cancel(reason) {
      settled.resolve();
      await reader.cancel(reason);
    }
  });
  const observedResponse = new FetchResponse(observedStream, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
  copyResponseOwnProperties(response, observedResponse);
  return {
    response: observedResponse,
    settled
  };
}
export {
  observeResponseBodyStream
};
//# sourceMappingURL=observe-response-body-stream.mjs.map