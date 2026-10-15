import { UnhandledRequestStrategy } from '../utils/request/onUnhandledRequest.mjs';
import { U as UnhandledFrameCallback } from '../on-unhandled-frame-gkokW4Rr.mjs';
import 'rettime';
import './handlers-controller.mjs';
import '../HttpResponse-BE_Y2Ak9.mjs';
import '@mswjs/interceptors';
import '../utils/internal/isIterable.mjs';
import '../typeUtils.mjs';
import 'graphql';
import '../utils/matching/matchRequestUrl.mjs';
import '../handlers/WebSocketHandler.mjs';
import 'strict-event-emitter';
import '@mswjs/interceptors/WebSocket';

declare function fromLegacyOnUnhandledRequest(getLegacyValue: () => UnhandledRequestStrategy | undefined): UnhandledFrameCallback;

export { fromLegacyOnUnhandledRequest };
