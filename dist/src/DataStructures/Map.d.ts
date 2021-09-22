export declare class Map2<U> extends Map<string, U> {
    constructor();
    arrayMap<V>(cb: (val?: U, key?: string) => V): V[];
    toArray(): U[];
    fromArray(array: U[], keyName?: string | "id"): this;
    fromArray2(array: U[], func: (item: U) => string): this;
}
