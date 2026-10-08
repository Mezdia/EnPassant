import { DateStringValue } from '../../../types';
import { PickerControlProps } from '../../PickerControl';
interface GetYearInTabOrderInput {
    years: DateStringValue[][];
    minDate: DateStringValue | Date | undefined;
    maxDate: DateStringValue | Date | undefined;
    getYearControlProps: ((year: DateStringValue) => Partial<PickerControlProps>) | undefined;
}
export declare function getYearInTabOrder({ years, minDate, maxDate, getYearControlProps, }: GetYearInTabOrderInput): string;
export {};
