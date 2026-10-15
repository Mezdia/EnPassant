import { TimePickerAmPmLabels, TimePickerFormat } from '../../TimePicker.types';
interface GetTimeStringInput {
    hours: number | null;
    minutes: number | null;
    seconds: number | null;
    format: TimePickerFormat;
    withSeconds: boolean;
    amPm: string | null;
    amPmLabels: TimePickerAmPmLabels;
}
export declare function getTimeString({ hours, minutes, seconds, format, withSeconds, amPm, amPmLabels, }: GetTimeStringInput): {
    valid: boolean;
    value: string;
};
export {};
