import { DateStringValue } from '../../../types';
import { PickerControlProps } from '../../PickerControl';
interface GetMonthInTabOrderInput {
    months: DateStringValue[][];
    minDate: DateStringValue | undefined;
    maxDate: DateStringValue | undefined;
    getMonthControlProps: ((month: DateStringValue) => Partial<PickerControlProps>) | undefined;
}
export declare function getMonthInTabOrder({ months, minDate, maxDate, getMonthControlProps, }: GetMonthInTabOrderInput): string;
export {};
