import { Headers as HeadersPolyfill } from "headers-polyfill";
import { getCallFrame } from '../utils/internal/getCallFrame.mjs';
import {
  isIterable
} from '../utils/internal/isIterable.mjs';
import {
} from '../HttpResponse.mjs';
import { devUtils } from '../utils/internal/devUtils.mjs';
import { getRawSetCookie } from '../utils/HttpResponse/decorators.mjs';
import { observeResponseBodyStream } from '../utils/internal/observe-response-body-stream.mjs';
class RequestHandler {
  static cache = /* @__PURE__ */ new WeakMap();
  kind = "request";
  resolver;
  resolverIterator;
  resolverIteratorResult;
  resolverIteratorCleanups;
  options;
  scheduledCleanups;
  info;
  /**
   * Indicates whether this request handler has been used
   * (its resolver has successfully executed).
   */
  isUsed;
  constructor(args) {
    this.resolver = args.resolver;
    this.options = args.options;
    this.scheduledCleanups = /* @__PURE__ */ new Map();
    const callFrame = getCallFrame(new Error());
    this.info = {
      ...args.info,
      callFrame
    };
    this.isUsed = false;
  }
  /**
   * Reset the runtime state accumulated during response resolution,
   * such as generator iterator progress. Called when this handler is
   * removed from the active handlers list so re-adding it later starts
   * from a clean state.
   */
  reset() {
    this.scheduledCleanups.clear();
    const iterator = this.resolverIterator;
    this.resolverIterator = void 0;
    this.resolverIteratorResult = void 0;
    this.resolverIteratorCleanups = void 0;
    if (typeof iterator?.return === "function") {
      void Promise.resolve(iterator.return());
    }
  }
  /**
   * Restore this handler so it can match requests again after being
   * exhausted (e.g. via `{ once: true }`). Also clears any accumulated
   * resolution state.
   */
  restore() {
    if (this.options?.once) {
      this.reset();
      this.isUsed = false;
    }
  }
  /**
   * Parse the intercepted request to extract additional information from it.
   * Parsed result is then exposed to other methods of this request handler.
   */
  async parse(_args) {
    return {};
  }
  /**
   * Test if this handler matches the given request.
   *
   * This method is not used internally but is exposed
   * as a convenience method for consumers writing custom
   * handlers.
   */
  async test(args) {
    const parsedResult = await this.parse({
      request: args.request,
      resolutionContext: args.resolutionContext
    });
    return this.predicate({
      request: args.request,
      parsedResult,
      resolutionContext: args.resolutionContext
    });
  }
  extendResolverArgs(_args) {
    return {};
  }
  // Clone the request instance before it's passed to the handler phases
  // and the response resolver so we can always read it for logging.
  // We only clone it once per request to avoid unnecessary overhead.
  cloneRequestOrGetFromCache(request) {
    const existingClone = RequestHandler.cache.get(request);
    if (typeof existingClone !== "undefined") {
      return existingClone;
    }
    const clonedRequest = request.clone();
    RequestHandler.cache.set(request, clonedRequest);
    return clonedRequest;
  }
  /**
   * Execute this request handler and produce a mocked response
   * using the given resolver function.
   */
  async run(args) {
    if (this.isUsed && this.options?.once) {
      return null;
    }
    const requestClone = this.cloneRequestOrGetFromCache(args.request);
    const parsedResult = await this.parse({
      request: args.request,
      resolutionContext: args.resolutionContext
    });
    const shouldInterceptRequest = await this.predicate({
      request: args.request,
      parsedResult,
      resolutionContext: args.resolutionContext
    });
    if (!shouldInterceptRequest) {
      return null;
    }
    if (this.isUsed && this.options?.once) {
      return null;
    }
    this.isUsed = true;
    const executeResolver = this.wrapResolver(this.resolver);
    const resolverExtras = this.extendResolverArgs({
      request: args.request,
      parsedResult
    });
    const listenerController = new AbortController();
    let finalizeFunction;
    const getFinalize = () => {
      if (finalizeFunction == null) {
        if (!args.request.signal.aborted) {
          args.request.signal.addEventListener(
            "abort",
            () => this.runScheduledCleanups(args.requestId),
            {
              once: true,
              signal: listenerController.signal
            }
          );
        }
        finalizeFunction = (callback) => {
          this.scheduleCleanup(args.requestId, callback);
          if (args.request.signal.aborted) {
            void this.runScheduledCleanups(args.requestId);
          }
        };
      }
      return finalizeFunction;
    };
    const mockedResponsePromise = executeResolver({
      ...resolverExtras,
      get finalize() {
        return getFinalize();
      },
      requestId: args.requestId,
      request: args.request
    }).catch((errorOrResponse) => {
      if (errorOrResponse instanceof Response) {
        return errorOrResponse;
      }
      throw errorOrResponse;
    }).finally(() => {
      listenerController.abort();
    });
    const mockedResponse = await mockedResponsePromise;
    if (mockedResponse) {
      forwardResponseCookies(mockedResponse);
    }
    const executionResult = this.createExecutionResult({
      // Pass the cloned request to the result so that logging
      // and other consumers could read its body once more.
      request: requestClone,
      requestId: args.requestId,
      response: mockedResponse,
      parsedResult
    });
    return executionResult;
  }
  wrapResolver(resolver) {
    return async (info) => {
      if (!this.resolverIterator) {
        let result;
        try {
          result = await resolver(info);
        } catch (error) {
          await this.runScheduledCleanups(info.requestId);
          throw error;
        }
        if (!isIterable(result)) {
          return this.complete({
            request: info.request,
            requestId: info.requestId,
            response: result
          });
        }
        const existingCleanups = this.scheduledCleanups.get(info.requestId);
        if (existingCleanups != null && existingCleanups.length > 0) {
          this.resolverIteratorCleanups = existingCleanups;
          this.scheduledCleanups.delete(info.requestId);
        }
        this.resolverIterator = Symbol.iterator in result ? result[Symbol.iterator]() : result[Symbol.asyncIterator]();
      }
      this.isUsed = false;
      const { done, value } = await this.resolverIterator.next();
      const nextResponse = await value;
      if (nextResponse) {
        this.resolverIteratorResult = nextResponse.clone();
      }
      if (done) {
        this.isUsed = true;
        return this.complete({
          request: info.request,
          requestId: info.requestId,
          response: this.resolverIteratorResult?.clone()
        });
      }
      return nextResponse;
    };
  }
  createExecutionResult(args) {
    return {
      handler: this,
      request: args.request,
      requestId: args.requestId,
      response: args.response,
      parsedResult: args.parsedResult
    };
  }
  scheduleCleanup(requestId, callback) {
    if (this.resolverIterator) {
      ;
      (this.resolverIteratorCleanups ||= []).unshift(callback);
      return;
    }
    const cleanups = this.scheduledCleanups.get(requestId) || [];
    cleanups.unshift(callback);
    this.scheduledCleanups.set(requestId, cleanups);
  }
  async exhaustCleanups(cleanups) {
    const errors = [];
    for (const cleanup of cleanups) {
      try {
        await cleanup();
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error);
        }
      }
    }
    if (errors.length > 0) {
      devUtils.error(
        'Failed to execute cleanup for request handler "%s"',
        this.info.header,
        new AggregateError(
          errors,
          `Failed to execute cleanup for request handler "${this.info.header}"`
        )
      );
    }
  }
  /**
   * Remove and return the cleanups scheduled for the given request
   * (or the pending iterator cleanups for generator resolvers).
   */
  takeScheduledCleanups(requestId) {
    if (this.resolverIterator && this.resolverIteratorCleanups != null && this.resolverIteratorCleanups.length > 0) {
      const cleanups2 = this.resolverIteratorCleanups;
      this.resolverIteratorCleanups = void 0;
      return cleanups2;
    }
    const cleanups = this.scheduledCleanups.get(requestId);
    if (!cleanups || cleanups.length === 0) {
      return void 0;
    }
    this.scheduledCleanups.delete(requestId);
    return cleanups;
  }
  async runScheduledCleanups(requestId) {
    const cleanups = this.takeScheduledCleanups(requestId);
    if (cleanups) {
      await this.exhaustCleanups(cleanups);
    }
  }
  /**
   * Conclude the response resolution for the given request.
   * Runs the scheduled cleanups immediately for responses without a
   * `ReadableStream` body. For streamed responses, returns an observed
   * copy of the response and defers the cleanups until its body settles
   * (is read to completion, errored, or canceled) or the request is
   * aborted, whichever comes first.
   */
  async complete(args) {
    const cleanups = this.takeScheduledCleanups(args.requestId);
    if (!cleanups) {
      return args.response;
    }
    const observedResponse = args.response ? observeResponseBodyStream(args.response) : null;
    if (!observedResponse) {
      await this.exhaustCleanups(cleanups);
      return args.response;
    }
    const listenerController = new AbortController();
    const runCleanupsOnce = () => {
      if (listenerController.signal.aborted) {
        return;
      }
      listenerController.abort();
      void this.exhaustCleanups(cleanups);
    };
    void observedResponse.settled.then(runCleanupsOnce);
    if (args.request.signal.aborted) {
      runCleanupsOnce();
    } else {
      args.request.signal.addEventListener("abort", runCleanupsOnce, {
        once: true,
        signal: listenerController.signal
      });
    }
    return observedResponse.response;
  }
}
function forwardResponseCookies(response) {
  if (typeof document === "undefined") {
    return;
  }
  const responseCookies = getRawSetCookie(response);
  if (!responseCookies) {
    return;
  }
  const allResponseCookies = HeadersPolyfill.prototype.getSetCookie.call(
    new Headers([["set-cookie", responseCookies]])
  );
  for (const cookieString of allResponseCookies) {
    document.cookie = cookieString;
  }
}
export {
  RequestHandler,
  forwardResponseCookies
};
//# sourceMappingURL=RequestHandler.mjs.map