interface TimeControlProps {
    value: number | string;
    active: boolean;
    onSelect: (value: any) => void;
}
export declare function TimeControl({ value, active, onSelect }: TimeControlProps): import("react/jsx-runtime").JSX.Element;
export declare namespace TimeControl {
    var displayName: string;
}
export {};
