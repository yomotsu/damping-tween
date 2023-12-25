interface Values {
    [key: string]: number;
}
export declare class DampingTween {
    active: boolean;
    dampingFactor: number;
    private _keys;
    private _currentValues;
    private _endValues;
    private _deltaValues;
    constructor(values: Values | number, dampingFactor?: number);
    readonly values: Values;
    readonly endValues: Values;
    setValues(values: Values, immediate?: boolean): void;
    setValue(key: string, value: number, immediate?: boolean): void;
    value: number;
    endValue: number;
    stop(): void;
    update(delta: number): boolean;
}
export {};
