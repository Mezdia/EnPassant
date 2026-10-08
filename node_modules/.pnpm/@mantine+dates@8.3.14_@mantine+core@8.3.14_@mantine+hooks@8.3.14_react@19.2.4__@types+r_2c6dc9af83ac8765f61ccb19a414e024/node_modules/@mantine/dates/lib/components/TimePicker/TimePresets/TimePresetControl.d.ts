import { TimePickerAmPmLabels, TimePickerFormat } from '../TimePicker.types';
interface TimePresetControlProps {
    value: string;
    active: boolean;
    onChange: (value: string) => void;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
    withSeconds: boolean;
}
export declare function TimePresetControl({ value, active, onChange, format, amPmLabels, withSeconds, }: TimePresetControlProps): import("react/jsx-runtime").JSX.Element;
export declare namespace TimePresetControl {
    var displayName: string;
}
export {};
