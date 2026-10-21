interface IsSameTimeInput {
    time: string;
    compare: string;
    withSeconds: boolean;
}
export declare function isSameTime({ time, compare, withSeconds }: IsSameTimeInput): boolean;
export {};
