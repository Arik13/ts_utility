export {}
import "./Set";
import { Primitive } from "../Types";
import { extendPrototypeFromClassObj } from "./ExtendPrototype";

type IdObj = {id: string};
type SetType = Primitive | IdObj;

class Extension<T> {
    cross<U>(this: T[], array: U[]): [T, U][] {
        let cartesian = (...a: any[][]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
        return cartesian(this, array)
    }
    merge<U>(this: T[], array: U[]) {
        if (this.length != array.length) throw new Error("Cannot merge arrays of unequal length!");
        return this.map((x, i) => [x, array[i]]);
    }
    equals(this: T[], b: any[], pred?: (a: any, b: any) => boolean) {
        if (this.length != b.length) return false;
        let p = pred ?? ((a, b) => a === b);
        for (let i = 0; i < this.length; i++) {
            if (!p(this[i], b[i])) return false;
        }
        return true;
    }
    remove(this: T[], pred: (value: T, index: number, array: T[]) => boolean): T {
        let index = this.findIndex(pred);
        let item = this[index];
        this.splice(index, 1);
        return item;
    }

    // SET OPERATIONS
    diff<T extends SetType>(this: T[], array: T[]): T[] {
        return Array.from(new Set(this).difference(new Set(array)));
    }
    symDiff<T extends SetType>(this: T[], array: T[]) {
        return Array.from(new Set(this).symmetricDifference(new Set(array)));
    }
    intersect<T extends SetType>(this: T[], array: T[]) {
        return Array.from(new Set(this).intersection(new Set(array)));
    }
    union<T extends SetType>(this: T[], array: T[]) {
        return Array.from(new Set(this).union(new Set(array)));
    }
    unique<T extends SetType>(this: T[]) {
        return Array.from(new Set(this));
    }
}

declare global {
    interface Array<T> extends Extension<T> {}
}
extendPrototypeFromClassObj(Array.prototype, new Extension());