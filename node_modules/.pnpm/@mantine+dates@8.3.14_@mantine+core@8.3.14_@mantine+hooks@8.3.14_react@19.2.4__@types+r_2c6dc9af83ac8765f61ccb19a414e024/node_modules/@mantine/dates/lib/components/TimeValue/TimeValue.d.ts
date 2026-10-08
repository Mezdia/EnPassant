import type { TimePickerAmPmLabels, TimePickerFormat } from '../TimePicker';
export interface TimeValueProps {
    /** Time to format */
    value: string | Date;
    /** Time format @default `'24h'` */
    format?: TimePickerFormat;
    /** AM/PM labels @default `{ am: 'AM', pm: 'PM' }` */
    amPmLabels?: TimePickerAmPmLabels;
    /** Determines whether seconds should be displayed @default `false` */
    withSeconds?: boolean;
}
export declare function TimeValue({ value, format, amPmLabels, withSeconds, }: TimeValueProps): import("react/jsx-runtime").JSX.Element;
export declare namespace TimeValue {
    var displayName: string;
}
