import { DayOfWeek } from '../../types';
export interface DatesProviderValue {
    locale: string;
    firstDayOfWeek: DayOfWeek;
    weekendDays: DayOfWeek[];
    labelSeparator: string;
    consistentWeeks: boolean;
}
export type DatesProviderSettings = Partial<DatesProviderValue>;
export declare const DATES_PROVIDER_DEFAULT_SETTINGS: DatesProviderValue;
export declare const DatesProviderContext: import("react").Context<DatesProviderValue>;
export interface DatesProviderProps {
    settings: DatesProviderSettings;
    children?: React.ReactNode;
}
export declare function DatesProvider({ settings, children }: DatesProviderProps): import("react/jsx-runtime").JSX.Element;
