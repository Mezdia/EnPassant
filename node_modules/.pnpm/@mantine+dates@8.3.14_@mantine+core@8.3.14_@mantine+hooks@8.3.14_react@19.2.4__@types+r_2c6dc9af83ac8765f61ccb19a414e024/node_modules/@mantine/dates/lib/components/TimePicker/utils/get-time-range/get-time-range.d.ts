interface GetTimeRangeInput {
    startTime: string;
    endTime: string;
    interval: string;
}
export declare function getTimeRange({ startTime, endTime, interval }: GetTimeRangeInput): string[];
export {};
