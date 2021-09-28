import { Key } from "@util/Types";
export {};
declare type IdObj = {
    id: Key;
};
interface MapExtension<K, V> {
    arrayMap<T>(this: Map<K, V>, cb: (val?: V, key?: T) => V): T[];
    toArray(this: Map<K, V>): V[];
    fromArray<T extends IdObj>(this: Map<K, V>, array: T[]): Map<string, T>;
    fromArray<T>(this: Map<K, V>, array: T[], keyName: string): Map<K, V>;
    fromArray2(this: Map<K, V>, array: V[], func: (item: V) => K): Map<K, V>;
}
declare global {
    interface Map<K, V> extends MapExtension<K, V> {
    }
}
