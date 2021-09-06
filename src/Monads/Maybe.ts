import { Monad } from "./Monads";

export class Maybe extends Monad<any[]> {
    condition: boolean = true;
    constructor(value?: any) {
        super(value? Maybe.getWrappedVal(value) : []);
    }
    // @ts-ignore
    map(func: (x: any[]) => any[]): Maybe {
        return Maybe.init(func(this.getValue()), this.condition)
    }
    flatMap(func: (x: any) => any) {
        return func(this.getValue());
    }
    if<T>(arg: T, predicate?: (x: T, p?: any) => any) {
        if (this.validate(arg, predicate))
            return Maybe.init(arg, true);
        return Maybe.init(null, false);
    }
    elseIf<T>(arg: T, predicate?: (x: T, p?: any) => any) {
        if (this.condition)
            return Maybe.init(this.getValue(), false);
        return this.if(arg, predicate);
    }
    else() {
        return Maybe.init(this.getValue(), !this.condition);
    }
    then(func?: (arg: any) => any) {
        if (this.condition) {
            let arg = func(this.getValue());
            return Maybe.init(arg, this.condition);
        }
        return this;
    }
    return() {
        return Maybe.isValid(this.val[0])? this.val[0] : [];
    }
    private getValue() {
        return this.val[0];
    }
    static maybe<T, U>(arg: T, f: (arg: T, p?: any) => U | any[], p?: any) {
        return Maybe.isValid(arg)? f(arg, p) : [];
    }
    private validate<T>(arg: T, predicate?: (x: T, p?: any) => any) {
        return Maybe.isValid(arg) && (!predicate || predicate(arg))
    }
    private set(val: any) {
        this.val = val;
        return this;
    }
    private static isValid(val: any) {
        return !(Array.isArray(val) && !val.length || !val);
    }
    private static getWrappedVal(val: any) {
        return Maybe.isValid(val)? [val] : [];
    }
    private static init(val: any, condition: boolean) {
        let m = new Maybe().set(Maybe.getWrappedVal(val));
        m.condition = condition;
        return m;
    }
}