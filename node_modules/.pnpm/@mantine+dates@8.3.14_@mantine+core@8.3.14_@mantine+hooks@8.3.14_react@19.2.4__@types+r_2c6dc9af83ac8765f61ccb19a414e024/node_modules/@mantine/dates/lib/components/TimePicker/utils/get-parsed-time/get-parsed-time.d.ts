import { TimePickerAmPmLabels, TimePickerFormat } from '../../TimePicker.types';
interface GetParsedTimeInput {
    time: string;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
}
interface ConvertTimeTo12HourFormatInput {
    hours: number | null;
    minutes: number | null;
    seconds: number | null;
    amPmLabels: TimePickerAmPmLabels;
}
export declare function convertTimeTo12HourFormat({ hours, minutes, seconds, amPmLabels, }: ConvertTimeTo12HourFormatInput): {
    hours: null;
    minutes: null;
    seconds: null;
    amPm: null;
} | {
    hours: number;
    minutes: number | null;
    seconds: number | null;
    amPm: string;
};
export declare function getParsedTime({ time, format, amPmLabels }: GetParsedTimeInput): {
    hours: number;
    minutes: number | null;
    seconds: number | null;
    amPm: string;
} | {
    amPm: null;
    hours: number | null;
    minutes: number | null;
    seconds: number | null;
};
export {};
