import type { TimePickerAmPmLabels, TimePickerFormat } from '../../TimePicker';
export interface GetFormattedTimeInput {
    value: string | Date;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
    withSeconds: boolean;
}
export declare function getFormattedTime({ value, format, amPmLabels, withSeconds, }: GetFormattedTimeInput): string | null;
