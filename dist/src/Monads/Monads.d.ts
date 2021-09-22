export declare abstract class Monad<T> {
    protected val: T;
    constructor(val: T);
    abstract map(func: (str: T) => T): Monad<T>;
    return(): T;
}
export declare class NumberMonad extends Monad<number> {
    constructor(val: number);
    map(func: (val: number) => number): NumberMonad;
    toStrMonad(func?: (val: number) => string): StringMonad;
}
export declare class StringMonad extends Monad<string> {
    constructor(val: string | number);
    map(func: (val: string) => string): StringMonad;
}
