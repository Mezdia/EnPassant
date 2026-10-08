import { i as HttpResponseInit, H as HttpResponse } from '../../HttpResponse-BE_Y2Ak9.mjs';
import '@mswjs/interceptors';
import '../internal/isIterable.mjs';
import '../../typeUtils.mjs';
import 'graphql';
import '../matching/matchRequestUrl.mjs';

interface HttpResponseDecoratedInit extends HttpResponseInit {
    status: number;
    statusText: string;
    headers: Headers;
}
declare function normalizeResponseInit(init?: HttpResponseInit): HttpResponseDecoratedInit;
declare function decorateResponse(response: HttpResponse<any>, init: HttpResponseDecoratedInit): Response;
declare function getRawSetCookie(response: Response): string | undefined;
/**
 * Copy the given response own properties, like internal symbols,
 * onto another response. Used for faithful internal copying of responses.
 */
declare function copyResponseOwnProperties(source: Response, target: Response): void;

export { type HttpResponseDecoratedInit, copyResponseOwnProperties, decorateResponse, getRawSetCookie, normalizeResponseInit };
