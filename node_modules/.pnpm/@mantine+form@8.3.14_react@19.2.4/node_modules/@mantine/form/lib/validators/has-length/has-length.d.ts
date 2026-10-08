interface HasLengthOptions {
    max?: number;
    min?: number;
}
type HasLengthPayload = HasLengthOptions | number;
export declare function hasLength(payload: HasLengthPayload, error?: React.ReactNode): (value: unknown) => React.ReactNode;
export {};
