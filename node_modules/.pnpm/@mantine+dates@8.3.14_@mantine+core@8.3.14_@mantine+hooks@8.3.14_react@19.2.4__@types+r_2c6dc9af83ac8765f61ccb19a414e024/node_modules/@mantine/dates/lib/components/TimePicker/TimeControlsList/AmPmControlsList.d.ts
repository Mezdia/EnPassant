interface AmPmControlsListProps {
    value: string | null;
    onSelect: (value: string) => void;
    labels: {
        am: string;
        pm: string;
    };
}
export declare function AmPmControlsList({ labels, value, onSelect }: AmPmControlsListProps): import("react/jsx-runtime").JSX.Element;
export declare namespace AmPmControlsList {
    var displayName: string;
}
export {};
