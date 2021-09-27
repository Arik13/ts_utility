export type Primitive = boolean | number | string;
export type Key = number | string | symbol;

export type Constructable<T> = new(...args: any[]) => T;
