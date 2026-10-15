interface ObservedResponse {
    response: Response;
    /**
     * A promise that resolves once the response body stream has settled:
     * it was closed, errored, or canceled, and will not be used anymore.
     */
    settled: Promise<void>;
}
/**
 * Observe the `ReadableStream` body of the given response.
 * Returns a copy of that response whose body reports when it has
 * settled (was read to completion, errored, or canceled by the consumer).
 * Returns `null` for responses whose body cannot be observed
 * (no body, already used, or locked).
 */
declare function observeResponseBodyStream(response: Response): ObservedResponse | null;

export { type ObservedResponse, observeResponseBodyStream };
