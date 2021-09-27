export {};
import "./Set";
import { Primitive } from "../Types";
interface ArrayExtension<T> {
    cross<U>(array: U[]): [T, U][];
    merge<U>(array: U[]): [T, U][];
    equals<U>(this: T[], b: U[], pred?: (a: T, b: U) => boolean): boolean;
    diff<T extends Primitive>(this: T[], array: T[]): T[];
    symDiff<T extends Primitive>(this: T[], array: T[]): T[];
    intersect<T extends Primitive>(this: T[], array: T[]): T[];
    union<T extends Primitive>(this: T[], array: T[]): T[];
    unique<T extends Primitive>(this: T[]): T[];
    diff<T extends {
        id: string | number;
    }>(this: T[], array: T[]): T[];
    symDiff<T extends {
        id: string | number;
    }>(this: T[], array: T[]): T[];
    intersect<T extends {
        id: string | number;
    }>(this: T[], array: T[]): T[];
    union<T extends {
        id: string | number;
    }>(this: T[], array: T[]): T[];
    unique<T extends {
        id: string | number;
    }>(this: T[]): T[];
}
declare global {
    interface Array<T> extends ArrayExtension<T> {
    }
}
