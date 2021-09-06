export type Primitive = boolean | number | string;

export type Constructable<T> = new(...args: any[]) => T;