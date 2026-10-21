interface SpinInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> {
    value: number | null;
    min: number;
    max: number;
    onChange: (value: number | null) => void;
    focusable: boolean;
    step: number;
    onNextInput?: () => void;
    onPreviousInput?: () => void;
    allowTemporaryZero?: boolean;
    placeholder?: string;
}
export declare const SpinInput: import("react").ForwardRefExoticComponent<SpinInputProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
