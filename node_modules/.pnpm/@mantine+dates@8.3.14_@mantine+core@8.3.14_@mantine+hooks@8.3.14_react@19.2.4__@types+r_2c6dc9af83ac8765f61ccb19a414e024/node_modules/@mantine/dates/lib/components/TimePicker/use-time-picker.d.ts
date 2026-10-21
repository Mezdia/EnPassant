import type { TimePickerAmPmLabels, TimePickerFormat, TimePickerPasteSplit } from './TimePicker.types';
interface UseTimePickerInput {
    value: string | undefined;
    defaultValue: string | undefined;
    onChange: ((value: string) => void) | undefined;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
    withSeconds: boolean | undefined;
    min: string | undefined;
    max: string | undefined;
    readOnly: boolean | undefined;
    disabled: boolean | undefined;
    clearable: boolean | undefined;
    pasteSplit: TimePickerPasteSplit | undefined;
}
export declare function useTimePicker({ value, defaultValue, onChange, format, amPmLabels, withSeconds, min, max, clearable, readOnly, disabled, pasteSplit, }: UseTimePickerInput): {
    refs: {
        hours: import("react").RefObject<HTMLInputElement | null>;
        minutes: import("react").RefObject<HTMLInputElement | null>;
        seconds: import("react").RefObject<HTMLInputElement | null>;
        amPm: import("react").RefObject<HTMLSelectElement | null>;
    };
    values: {
        hours: number | null;
        minutes: number | null;
        seconds: number | null;
        amPm: string | null;
    };
    setHours: (value: number | null) => void;
    setMinutes: (value: number | null) => void;
    setSeconds: (value: number | null) => void;
    setAmPm: (value: string | null) => void;
    focus: (field: "hours" | "minutes" | "seconds" | "amPm") => void;
    clear: () => void;
    onPaste: (event: React.ClipboardEvent<any>) => void;
    setTimeString: (timeString: string) => void;
    isClearable: boolean | undefined;
    hiddenInputValue: string;
};
export {};
