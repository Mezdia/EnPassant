import React from 'react';
interface AmPmInputProps extends Omit<React.ComponentPropsWithoutRef<'select'>, 'value' | 'onChange'> {
    labels: {
        am: string;
        pm: string;
    };
    value: string | null;
    inputType: 'select' | 'input';
    onChange: (value: string | null) => void;
    readOnly?: boolean;
    onPreviousInput?: () => void;
}
export declare const AmPmInput: React.ForwardRefExoticComponent<AmPmInputProps & React.RefAttributes<HTMLSelectElement>>;
export {};
