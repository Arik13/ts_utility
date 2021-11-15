export {};
import "./Set";
import { Primitive } from "../Types";
declare type IdObj = {
    id: string;
};
declare type SetType = Primitive | IdObj;
declare class Extension<T> {
    cross<U>(this: T[], array: U[]): [T, U][];
    merge<U>(this: T[], array: U[]): (T | U)[][];
    equals(this: T[], b: any[], pred?: (a: any, b: any) => boolean): boolean;
    remove(this: T[], pred: (value: T, index: number, array: T[]) => boolean): T;
    diff<T extends SetType>(this: T[], array: T[]): T[] | IdObj[];
    symDiff<T extends SetType>(this: T[], array: T[]): IdObj[] | T[];
    intersect<T extends SetType>(this: T[], array: T[]): IdObj[] | T[];
    union<T extends SetType>(this: T[], array: T[]): IdObj[] | T[];
    unique<T extends SetType>(this: T[]): IdObj[] | T[];
}
declare global {
    interface Array<T> extends Extension<T> {
    }
}
