import { Monad } from "./Monads";
export declare class Maybe extends Monad<any[]> {
    condition: boolean;
    constructor(value?: any);
    map(func: (x: any[]) => any[]): Maybe;
    flatMap(func: (x: any) => any): any;
    if<T>(arg: T, predicate?: (x: T, p?: any) => any): Maybe;
    elseIf<T>(arg: T, predicate?: (x: T, p?: any) => any): Maybe;
    else(): Maybe;
    then(func?: (arg: any) => any): Maybe;
    return(): any;
    private getValue;
    static maybe<T, U>(arg: T, f: (arg: T, p?: any) => U | any[], p?: any): any[] | U;
    private validate;
    private set;
    private static isValid;
    private static getWrappedVal;
    private static init;
}
