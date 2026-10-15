import { ReadableStream } from "node:stream/web";
import { Readable } from "node:stream";
import { TSR_SCRIPT_BARRIER_ID } from "./constants.js";
function transformReadableStreamWithRouter(router, routerStream) {
  return transformStreamWithRouter(router, routerStream);
}
function transformPipeableStreamWithRouter(router, routerStream) {
  return Readable.fromWeb(
    transformStreamWithRouter(router, Readable.toWeb(routerStream))
  );
}
const BODY_END_TAG = "</body>";
const HTML_END_TAG = "</html>";
const MIN_CLOSING_TAG_LENGTH = 4;
const DEFAULT_SERIALIZATION_TIMEOUT_MS = 6e4;
const DEFAULT_LIFETIME_TIMEOUT_MS = 6e4;
const textEncoder = new TextEncoder();
function findLastClosingTagEnd(str) {
  const len = str.length;
  if (len < MIN_CLOSING_TAG_LENGTH) return -1;
  let i = len - 1;
  while (i >= MIN_CLOSING_TAG_LENGTH - 1) {
    if (str.charCodeAt(i) === 62) {
      let j = i - 1;
      while (j >= 1) {
        const code = str.charCodeAt(j);
        if (code >= 97 && code <= 122 || // a-z
        code >= 65 && code <= 90 || // A-Z
        code >= 48 && code <= 57 || // 0-9
        code === 95 || // _
        code === 58 || // :
        code === 46 || // .
        code === 45) {
          j--;
        } else {
          break;
        }
      }
      const tagNameStart = j + 1;
      if (tagNameStart < i) {
        const startCode = str.charCodeAt(tagNameStart);
        if (startCode >= 97 && startCode <= 122 || startCode >= 65 && startCode <= 90) {
          if (j >= 1 && str.charCodeAt(j) === 47 && str.charCodeAt(j - 1) === 60) {
            return i + 1;
          }
        }
      }
    }
    i--;
  }
  return -1;
}
function transformStreamWithRouter(router, appStream, opts) {
  const serializationAlreadyFinished = router.serverSsr?.isSerializationFinished() ?? false;
  const initialBufferedHtml = router.serverSsr?.takeBufferedHtml();
  if (serializationAlreadyFinished && !initialBufferedHtml) {
    let cleanedUp2 = false;
    let controller2;
    let isStreamClosed2 = false;
    let lifetimeTimeoutHandle2;
    const cleanup2 = () => {
      if (cleanedUp2) return;
      cleanedUp2 = true;
      if (lifetimeTimeoutHandle2 !== void 0) {
        clearTimeout(lifetimeTimeoutHandle2);
        lifetimeTimeoutHandle2 = void 0;
      }
      router.serverSsr?.cleanup();
    };
    const safeClose2 = () => {
      if (isStreamClosed2) return;
      isStreamClosed2 = true;
      try {
        controller2?.close();
      } catch {
      }
    };
    const safeError2 = (error) => {
      if (isStreamClosed2) return;
      isStreamClosed2 = true;
      try {
        controller2?.error(error);
      } catch {
      }
    };
    const lifetimeMs2 = opts?.lifetimeMs ?? DEFAULT_LIFETIME_TIMEOUT_MS;
    lifetimeTimeoutHandle2 = setTimeout(() => {
      if (!cleanedUp2 && !isStreamClosed2) {
        console.warn(
          `SSR stream transform exceeded maximum lifetime (${lifetimeMs2}ms), forcing cleanup`
        );
        safeError2(new Error("Stream lifetime exceeded"));
        cleanup2();
      }
    }, lifetimeMs2);
    const stream2 = new ReadableStream({
      start(c) {
        controller2 = c;
      },
      cancel() {
        isStreamClosed2 = true;
        cleanup2();
      }
    });
    (async () => {
      const reader = appStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (cleanedUp2 || isStreamClosed2) return;
          controller2?.enqueue(value);
        }
        if (cleanedUp2 || isStreamClosed2) return;
        router.serverSsr?.setRenderFinished();
        safeClose2();
        cleanup2();
      } catch (error) {
        if (cleanedUp2) return;
        console.error("Error reading appStream:", error);
        router.serverSsr?.setRenderFinished();
        safeError2(error);
        cleanup2();
      } finally {
        reader.releaseLock();
      }
    })().catch((error) => {
      if (cleanedUp2) return;
      console.error("Error in stream transform:", error);
      safeError2(error);
      cleanup2();
    });
    return stream2;
  }
  let stopListeningToInjectedHtml;
  let stopListeningToSerializationFinished;
  let serializationTimeoutHandle;
  let lifetimeTimeoutHandle;
  let cleanedUp = false;
  let controller;
  let isStreamClosed = false;
  const textDecoder = new TextDecoder();
  let pendingRouterHtml = initialBufferedHtml ?? "";
  let leftover = "";
  let pendingClosingTags = "";
  const MAX_LEFTOVER_CHARS = 2048;
  let isAppRendering = true;
  let streamBarrierLifted = false;
  let serializationFinished = serializationAlreadyFinished;
  function safeEnqueue(chunk) {
    if (isStreamClosed) return;
    if (typeof chunk === "string") {
      controller.enqueue(textEncoder.encode(chunk));
    } else {
      controller.enqueue(chunk);
    }
  }
  function safeClose() {
    if (isStreamClosed) return;
    isStreamClosed = true;
    try {
      controller.close();
    } catch {
    }
  }
  function safeError(error) {
    if (isStreamClosed) return;
    isStreamClosed = true;
    try {
      controller.error(error);
    } catch {
    }
  }
  function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    try {
      stopListeningToInjectedHtml?.();
      stopListeningToSerializationFinished?.();
    } catch {
    }
    stopListeningToInjectedHtml = void 0;
    stopListeningToSerializationFinished = void 0;
    if (serializationTimeoutHandle !== void 0) {
      clearTimeout(serializationTimeoutHandle);
      serializationTimeoutHandle = void 0;
    }
    if (lifetimeTimeoutHandle !== void 0) {
      clearTimeout(lifetimeTimeoutHandle);
      lifetimeTimeoutHandle = void 0;
    }
    pendingRouterHtml = "";
    leftover = "";
    pendingClosingTags = "";
    router.serverSsr?.cleanup();
  }
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
    cancel() {
      isStreamClosed = true;
      cleanup();
    }
  });
  function flushPendingRouterHtml() {
    if (!pendingRouterHtml) return;
    safeEnqueue(pendingRouterHtml);
    pendingRouterHtml = "";
  }
  function appendRouterHtml(html) {
    if (!html) return;
    pendingRouterHtml += html;
  }
  function tryFinish() {
    if (isAppRendering || !serializationFinished) return;
    if (cleanedUp || isStreamClosed) return;
    if (serializationTimeoutHandle !== void 0) {
      clearTimeout(serializationTimeoutHandle);
      serializationTimeoutHandle = void 0;
    }
    const decoderRemainder = textDecoder.decode();
    if (leftover) safeEnqueue(leftover);
    if (decoderRemainder) safeEnqueue(decoderRemainder);
    flushPendingRouterHtml();
    if (pendingClosingTags) safeEnqueue(pendingClosingTags);
    safeClose();
    cleanup();
  }
  const lifetimeMs = opts?.lifetimeMs ?? DEFAULT_LIFETIME_TIMEOUT_MS;
  lifetimeTimeoutHandle = setTimeout(() => {
    if (!cleanedUp && !isStreamClosed) {
      console.warn(
        `SSR stream transform exceeded maximum lifetime (${lifetimeMs}ms), forcing cleanup`
      );
      safeError(new Error("Stream lifetime exceeded"));
      cleanup();
    }
  }, lifetimeMs);
  if (!serializationAlreadyFinished) {
    stopListeningToInjectedHtml = router.subscribe("onInjectedHtml", () => {
      if (cleanedUp || isStreamClosed) return;
      const html = router.serverSsr?.takeBufferedHtml();
      if (!html) return;
      if (isAppRendering || leftover || pendingClosingTags) {
        appendRouterHtml(html);
      } else {
        safeEnqueue(html);
      }
    });
    stopListeningToSerializationFinished = router.subscribe(
      "onSerializationFinished",
      () => {
        serializationFinished = true;
        tryFinish();
      }
    );
  }
  (async () => {
    const reader = appStream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (cleanedUp || isStreamClosed) return;
        const text = value instanceof Uint8Array ? textDecoder.decode(value, { stream: true }) : String(value);
        const chunkString = leftover ? leftover + text : text;
        if (!streamBarrierLifted) {
          if (chunkString.includes(TSR_SCRIPT_BARRIER_ID)) {
            streamBarrierLifted = true;
            router.serverSsr?.liftScriptBarrier();
          }
        }
        if (pendingClosingTags) {
          pendingClosingTags += chunkString;
          leftover = "";
          continue;
        }
        const bodyEndIndex = chunkString.indexOf(BODY_END_TAG);
        const htmlEndIndex = chunkString.indexOf(HTML_END_TAG);
        if (bodyEndIndex !== -1 && htmlEndIndex !== -1 && bodyEndIndex < htmlEndIndex) {
          pendingClosingTags = chunkString.slice(bodyEndIndex);
          safeEnqueue(chunkString.slice(0, bodyEndIndex));
          flushPendingRouterHtml();
          leftover = "";
          continue;
        }
        const lastClosingTagEnd = findLastClosingTagEnd(chunkString);
        if (lastClosingTagEnd > 0) {
          safeEnqueue(chunkString.slice(0, lastClosingTagEnd));
          flushPendingRouterHtml();
          leftover = chunkString.slice(lastClosingTagEnd);
          if (leftover.length > MAX_LEFTOVER_CHARS) {
            safeEnqueue(leftover.slice(0, leftover.length - MAX_LEFTOVER_CHARS));
            leftover = leftover.slice(-MAX_LEFTOVER_CHARS);
          }
        } else {
          const combined = chunkString;
          if (combined.length > MAX_LEFTOVER_CHARS) {
            const flushUpto = combined.length - MAX_LEFTOVER_CHARS;
            safeEnqueue(combined.slice(0, flushUpto));
            leftover = combined.slice(flushUpto);
          } else {
            leftover = combined;
          }
        }
      }
      if (cleanedUp || isStreamClosed) return;
      isAppRendering = false;
      router.serverSsr?.setRenderFinished();
      if (serializationFinished) {
        tryFinish();
      } else {
        const timeoutMs = opts?.timeoutMs ?? DEFAULT_SERIALIZATION_TIMEOUT_MS;
        serializationTimeoutHandle = setTimeout(() => {
          if (!cleanedUp && !isStreamClosed) {
            console.error("Serialization timeout after app render finished");
            safeError(
              new Error("Serialization timeout after app render finished")
            );
            cleanup();
          }
        }, timeoutMs);
      }
    } catch (error) {
      if (cleanedUp) return;
      console.error("Error reading appStream:", error);
      isAppRendering = false;
      router.serverSsr?.setRenderFinished();
      safeError(error);
      cleanup();
    } finally {
      reader.releaseLock();
    }
  })().catch((error) => {
    if (cleanedUp) return;
    console.error("Error in stream transform:", error);
    safeError(error);
    cleanup();
  });
  return stream;
}
export {
  transformPipeableStreamWithRouter,
  transformReadableStreamWithRouter,
  transformStreamWithRouter
};
//# sourceMappingURL=transformStreamWithRouter.js.map
