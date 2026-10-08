export declare function getInputOnChange<Value>(setValue: (value: Value | ((current: Value) => Value)) => void): (val: Value | React.ChangeEvent<unknown> | ((current: Value) => Value)) => void;
