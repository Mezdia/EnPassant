import { TimePickerAmPmLabels, TimePickerFormat, TimePickerPresetGroup } from '../TimePicker.types';
interface TimePresetGroupProps {
    value: string;
    data: TimePickerPresetGroup;
    onChange: (value: string) => void;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
    withSeconds: boolean;
}
export declare function TimePresetGroup({ value, data, onChange, format, amPmLabels, withSeconds, }: TimePresetGroupProps): import("react/jsx-runtime").JSX.Element;
export declare namespace TimePresetGroup {
    var displayName: string;
}
export {};
