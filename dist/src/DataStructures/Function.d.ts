export {};
declare class Extension {
    _<T, U, V>(this: (...args: T[]) => U, func: (arg: U) => V): (...args: T[]) => V;
}
declare global {
    interface Function extends Extension {
    }
}
