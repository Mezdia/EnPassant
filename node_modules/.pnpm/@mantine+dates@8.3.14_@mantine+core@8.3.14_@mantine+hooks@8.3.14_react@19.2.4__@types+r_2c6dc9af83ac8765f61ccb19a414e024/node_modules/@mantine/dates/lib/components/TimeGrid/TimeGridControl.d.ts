import type { TimePickerAmPmLabels, TimePickerFormat } from '../TimePicker';
interface TimeGridControlProps extends React.ComponentPropsWithoutRef<'button'> {
    time: string;
    active: boolean;
    format: TimePickerFormat;
    amPmLabels: TimePickerAmPmLabels;
    withSeconds: boolean | undefined;
}
export declare function TimeGridControl({ time, active, className, amPmLabels, format, withSeconds, ...others }: TimeGridControlProps): import("react/jsx-runtime").JSX.Element;
export {};
