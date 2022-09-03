export {};
declare class Extension {
    isSuperset<T>(this: Set<T>, subset: Set<T>): boolean;
    union<T>(this: Set<T>, setB: Set<T>): Set<T>;
    intersection<T>(this: Set<T>, setB: Set<T>): Set<T>;
    symmetricDifference<T>(this: Set<T>, setB: Set<T>): Set<T>;
    difference<T>(this: Set<T>, setB: Set<T>): Set<T>;
}
declare global {
    interface Set<T> extends Extension {
    }
}
