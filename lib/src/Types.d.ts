export declare type Primitive = boolean | number | string;
export declare type Key = number | string | symbol;
export declare type Constructable<T> = new (...args: any[]) => T;
export declare type Dict<T = any> = {
    [key: string]: T;
};
