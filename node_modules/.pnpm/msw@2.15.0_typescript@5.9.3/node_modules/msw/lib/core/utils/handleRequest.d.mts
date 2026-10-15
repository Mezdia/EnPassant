import { Emitter } from 'strict-event-emitter';
import { SharedOptions, LifeCycleEventsMap } from '../sharedOptions.mjs';
import { RequiredDeep } from '../typeUtils.mjs';
import { k as ResponseResolutionContext, s as HandlersExecutionResult, R as RequestHandler } from '../HttpResponse-BE_Y2Ak9.mjs';
import 'rettime';
import './request/onUnhandledRequest.mjs';
import '@mswjs/interceptors';
import './internal/isIterable.mjs';
import 'graphql';
import './matching/matchRequestUrl.mjs';

interface HandleRequestOptions {
    /**
     * `resolutionContext` is not part of the general public api
     * but is exposed to aid in creating extensions like
     * `@mswjs/http-middleware`.
     */
    resolutionContext?: ResponseResolutionContext;
    /**
     * Invoked whenever a request is performed as-is.
     */
    onPassthroughResponse?(request: Request): void;
    /**
     * Invoked when the mocked response is ready to be sent.
     */
    onMockedResponse?(response: Response, handler: RequiredDeep<HandlersExecutionResult>): void;
}
declare function handleRequest(request: Request, requestId: string, handlers: Array<RequestHandler>, options: RequiredDeep<SharedOptions>, emitter: Emitter<LifeCycleEventsMap>, handleRequestOptions?: HandleRequestOptions): Promise<Response | undefined>;

export { type HandleRequestOptions, handleRequest };
