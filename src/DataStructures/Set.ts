import { extendPrototype } from "./ExtendPrototype";

export {}

interface SetExtension {
    isSuperset<T>(this: Set<T>, subset: Set<T>): boolean;
    union<T>(this: Set<T>, setB: Set<T>): Set<T>;
    intersection<T>(this: Set<T>, setB: Set<T>): Set<T>;
    symmetricDifference<T>(this: Set<T>, setB: Set<T>): Set<T>;
    difference<T>(this: Set<T>, setB: Set<T>): Set<T>;
}

declare global {
    interface Set<T> extends SetExtension {}
}

let methods: SetExtension = {
    isSuperset<T>(this: Set<T>, subset: Set<T>) {
        for (let elem of subset) {
            if (!this.has(elem)) {
                return false;
            }
        }
        return true;
    },
    union<T>(this: Set<T>, setB: Set<T>) {
        let union = new Set(this);
        for (let elem of setB) {
            union.add(elem);
        }
        return union;
    },
    intersection<T>(this: Set<T>, setB: Set<T>) {
        let intersection = new Set<T>();
        for (let elem of setB) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    },
    symmetricDifference<T>(this: Set<T>, setB: Set<T>) {
        let difference = new Set(this);
        for (let elem of setB) {
            if (difference.has(elem)) {
                difference.delete(elem);
            } else {
                difference.add(elem);
            }
        }
        return difference;
    },
    difference<T>(this: Set<T>, setB: Set<T>) {
        let difference = new Set(this);
        for (let elem of setB) {
            difference.delete(elem);
        }
        return difference;
    }
}
extendPrototype(Set.prototype, methods);