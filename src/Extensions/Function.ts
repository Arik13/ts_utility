import { extendPrototypeFromClassObj } from "./ExtendPrototype";

export {}

class Extension {
    _<T, U, V>(this: (...args: T[]) => U, func: (arg: U) => V) {
        return (...args: T[]) => func(this(...args));
    }
}

declare global {
    interface Function extends Extension {}
}

extendPrototypeFromClassObj(Function.prototype, new Extension());