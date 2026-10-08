import { DatePickerType, DateStringValue, PickerBaseProps } from '../../types';
interface UseDatesRangeInput<Type extends DatePickerType = 'default'> extends PickerBaseProps<Type> {
    level: 'year' | 'month' | 'day';
    type: Type;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export declare function useDatesState<Type extends DatePickerType = 'default'>({ type, level, value, defaultValue, onChange, allowSingleDateInRange, allowDeselect, onMouseLeave, }: UseDatesRangeInput<Type>): {
    onDateChange: (date: DateStringValue) => void;
    onRootMouseLeave: ((event: React.MouseEvent<HTMLDivElement>) => void) | undefined;
    onHoveredDateChange: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    getControlProps: (date: DateStringValue) => {
        selected: any;
        inRange: boolean;
        firstInRange: boolean;
        lastInRange: boolean;
        'data-autofocus': true | undefined;
    } | {
        selected: any;
        'data-autofocus': true | undefined;
        inRange?: undefined;
        firstInRange?: undefined;
        lastInRange?: undefined;
    };
    _value: any;
    setValue: any;
};
export {};
