export abstract class Monad<T> {
    protected val: T;
    constructor(val: T) {
        this.val = val;
    }
    abstract map(func: (str: T) => T): Monad<T>
    return() {
        return this.val;
    }
}

export class NumberMonad extends Monad<number> {
    constructor(val: number) {
        super(val);
    }
    map(func: (val: number) => number) {
        return new NumberMonad(func(this.val));
    }
    toStrMonad(func?: (val: number) => string) {
        let str = func? func(this.val) : String(this.val);
        return new StringMonad(str);
    }
}
export class StringMonad extends Monad<string> {
    constructor(val: string | number) {
        super(typeof val == "number"? String(val) : val);
    }
    map(func: (val: string) => string) {
        return new StringMonad(func(this.val));
    }
}