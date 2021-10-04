import { Key } from "@util/Types";
export {};
declare type IdObj = {
    id?: Key;
};
interface MapExtension<K, V> {
    arrayMap<T>(this: Map<K, V>, cb: (val?: V, key?: K) => T): T[];
    toArray(this: Map<K, V>): V[];
    fromArray<T extends (IdObj | V)>(this: Map<K, V>, array: T[]): Map<string, T>;
    fromArray<T>(this: Map<K, V>, array: T[], keyName: string): Map<K, V>;
    fromArray2(this: Map<K, V>, array: V[], func: (item: V) => K): Map<K, V>;
    map<V2>(this: Map<K, V>, cb: (val?: V, key?: K, map?: Map<K, V>) => any): Map<K, V2>;
}
declare global {
    interface Map<K, V> extends MapExtension<K, V> {
    }
}
