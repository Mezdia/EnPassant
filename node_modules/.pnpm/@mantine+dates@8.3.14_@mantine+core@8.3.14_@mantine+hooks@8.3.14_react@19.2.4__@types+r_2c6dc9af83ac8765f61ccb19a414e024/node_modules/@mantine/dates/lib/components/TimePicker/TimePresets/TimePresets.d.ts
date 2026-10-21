import { TimePickerAmPmLabels, TimePickerFormat, TimePickerPresets } from '../TimePicker.types';
interface TimePresetsProps {
    presets: TimePickerPresets;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
    value: string;
    withSeconds: boolean;
    onChange: (value: string) => void;
}
export declare function TimePresets({ presets, format, amPmLabels, withSeconds, value, onChange, }: TimePresetsProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace TimePresets {
    var displayName: string;
}
export {};
