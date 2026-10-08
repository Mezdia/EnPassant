interface IsInRangePayload {
    min?: number;
    max?: number;
}
export declare function isInRange({ min, max }: IsInRangePayload, error?: React.ReactNode): (value: unknown) => React.ReactNode;
export {};
