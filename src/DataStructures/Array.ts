export {}
import "./Set";
import { Primitive } from "../Types";
import { extendPrototype } from "./ExtendPrototype";
let prims = ["string", "number", "boolean"];
type IdObj = {id: string};
type SetType = Primitive | IdObj;

interface ArrayExtension<T> {
    cross<U>(array: U[]): [T, U][];
    merge<U>(array: U[]): [T, U][];
    equals<U>(this: T[], b: U[], pred?: (a: T, b: U) => boolean): boolean;

    diff<T extends Primitive>(this: T[], array: T[]): T[];
    symDiff<T extends Primitive>(this: T[], array: T[]): T[];
    intersect<T extends Primitive>(this: T[], array: T[]): T[];
    union<T extends Primitive>(this: T[], array: T[]): T[];
    unique<T extends Primitive>(this: T[]): T[];

    diff<T extends {id: string | number}>(this: T[], array: T[]): T[];
    symDiff<T extends {id: string | number}>(this: T[], array: T[]): T[];
    intersect<T extends {id: string | number}>(this: T[], array: T[]): T[];
    union<T extends {id: string | number}>(this: T[], array: T[]): T[];
    unique<T extends {id: string | number}>(this: T[]): T[];
}

declare global {
    interface Array<T> extends ArrayExtension<T> {}
}

class ArraySetData {
    array: IdObj[];
    keys: (string | number)[];
    indexDict: {[key: string]: number};
    constructor(array: IdObj[]) {
        this.array = array;
        this.keys = array.map(x => x.id);
        this.indexDict = Object.fromEntries(this.keys.map((x, i) => [x, i]));
    }
    toSet() {
        return new Set(this.keys);
    }
    get(key: string | number) {
        return this.array[this.indexDict[key]];
    }
}

let arrayMethods: ArrayExtension<any> = {
    cross<U>(this: any[], array: U[]) {
        let cartesian = (...a: any[][]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
        return cartesian(this, array)
    },
    merge<U>(this: any[], array: U[]) {
        if (this.length != array.length) throw new Error("Cannot merge arrays of unequal length!");
        return this.map((x, i) => [x, array[i]]);
    },
    equals(this: any[], b: any[], pred?: (a: any, b: any) => boolean) {
        if (this.length != b.length) return false;
        let p = pred ?? ((a, b) => a === b);
        for (let i = 0; i < this.length; i++) {
            if (!p(this[i], b[i])) return false;
        }
        return true;
    },

    // SET OPERATIONS
    diff<T extends SetType>(this: T[], array: T[]) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).difference(new Set(array)));
        }
        else {
            let a = new ArraySetData(this as IdObj[]);
            let b = new ArraySetData(array as IdObj[]);
            let diffSet = a.toSet().difference(b.toSet());
            return Array.from(diffSet).map(x => a.get(x) ?? b.get(x));
        }
    },
    symDiff<T extends SetType>(this: T[], array: T[]) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).symmetricDifference(new Set(array)));
        }
        else {
            let a = new ArraySetData(this as IdObj[]);
            let b = new ArraySetData(array as IdObj[]);
            let diffSet = a.toSet().symmetricDifference(b.toSet());
            return Array.from(diffSet).map(x => a.get(x) ?? b.get(x));
        }
    },
    intersect<T extends SetType>(this: T[], array: T[]) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).intersection(new Set(array)));
        }
        else {
            let a = new ArraySetData(this as IdObj[]);
            let b = new ArraySetData(array as IdObj[]);
            let diffSet = a.toSet().intersection(b.toSet());
            return Array.from(diffSet).map(x => a.get(x) ?? b.get(x));
        }
    },
    union<T extends SetType>(this: T[], array: T[]) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).union(new Set(array)));
        }
        else {
            let a = new ArraySetData(this as IdObj[]);
            let b = new ArraySetData(array as IdObj[]);
            let diffSet = a.toSet().union(b.toSet());
            return Array.from(diffSet).map(x => a.get(x) ?? b.get(x));
        }
    },
    unique<T extends SetType>(this: T[]) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this));
        }
        else {
            let a = new ArraySetData(this as IdObj[]);
            return Array.from(a.toSet()).map(x => a.get(x));
        }
    },
}
extendPrototype(Array.prototype, arrayMethods);