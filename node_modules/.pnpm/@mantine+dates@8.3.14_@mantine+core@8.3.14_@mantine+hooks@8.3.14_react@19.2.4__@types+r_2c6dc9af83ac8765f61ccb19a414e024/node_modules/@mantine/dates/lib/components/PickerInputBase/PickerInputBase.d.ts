import { __BaseInputProps, __InputStylesNames, BoxProps, ElementProps, Factory, InputVariant, MantineSize, ModalProps, PopoverProps, StylesApiProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerType } from '../../types';
import { DateFormatter } from '../../utils';
import { HiddenDatesInputValue } from '../HiddenDatesInput';
export type PickerInputBaseStylesNames = __InputStylesNames;
export interface DateInputSharedProps extends Omit<__BaseInputProps, 'size'>, ElementProps<'button', 'defaultValue' | 'value' | 'onChange' | 'type'> {
    /** Determines whether the dropdown is closed when date is selected, not applicable with `type="multiple"` @default `true` */
    closeOnChange?: boolean;
    /** Type of the dropdown @default `'popover'` */
    dropdownType?: 'popover' | 'modal';
    /** Props passed down to `Popover` component */
    popoverProps?: Partial<Omit<PopoverProps, 'children'>>;
    /** Props passed down to `Modal` component */
    modalProps?: Partial<Omit<ModalProps, 'children'>>;
    /** If set, clear button is displayed in the `rightSection` when the component has value. Ignored if `rightSection` prop is set. @default `false` */
    clearable?: boolean;
    /** Props passed down to the clear button */
    clearButtonProps?: React.ComponentPropsWithoutRef<'button'>;
    /** If set, the component value cannot be changed by the user */
    readOnly?: boolean;
    /** Determines whether dates values should be sorted before `onChange` call, only applicable with type="multiple" @default `true` */
    sortDates?: boolean;
    /** Separator between range value */
    labelSeparator?: string;
    /** Input placeholder */
    placeholder?: string;
    /** A function to format selected dates values into a string. By default, date is formatted based on the input type. */
    valueFormatter?: DateFormatter;
    /** Called when the dropdown is closed */
    onDropdownClose?: () => void;
}
export interface PickerInputBaseProps extends BoxProps, DateInputSharedProps, Omit<StylesApiProps<PickerInputBaseFactory>, 'classNames' | 'styles'> {
    classNames?: Partial<Record<string, string>>;
    styles?: Partial<Record<string, React.CSSProperties>>;
    __staticSelector?: string;
    children: React.ReactNode;
    formattedValue: string | null | undefined;
    dropdownHandlers: ReturnType<typeof useDisclosure>[1];
    dropdownOpened: boolean;
    onClear: () => void;
    shouldClear: boolean;
    value: HiddenDatesInputValue;
    type: DatePickerType;
    size?: MantineSize;
    withTime?: boolean;
}
export type PickerInputBaseFactory = Factory<{
    props: PickerInputBaseProps;
    ref: HTMLButtonElement;
    stylesNames: PickerInputBaseStylesNames;
    variant: InputVariant;
}>;
export declare const PickerInputBase: import("@mantine/core").MantineComponent<{
    props: PickerInputBaseProps;
    ref: HTMLButtonElement;
    stylesNames: PickerInputBaseStylesNames;
    variant: InputVariant;
}>;
