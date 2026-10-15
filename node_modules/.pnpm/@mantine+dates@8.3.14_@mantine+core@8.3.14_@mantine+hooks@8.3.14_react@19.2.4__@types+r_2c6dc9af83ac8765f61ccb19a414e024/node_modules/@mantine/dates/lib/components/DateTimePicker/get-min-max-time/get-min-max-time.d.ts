import { DateStringValue } from '../../../types';
interface GetMinTimeInput {
    minDate: DateStringValue | Date | undefined;
    value: DateStringValue | null;
}
export declare function getMinTime({ minDate, value }: GetMinTimeInput): string | undefined;
interface GetMaxTimeInput {
    maxDate: DateStringValue | Date | undefined;
    value: DateStringValue | null;
}
export declare function getMaxTime({ maxDate, value }: GetMaxTimeInput): string | undefined;
export {};
