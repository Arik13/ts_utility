import { Key } from "@util/Types";
import { extendPrototype } from "./ExtendPrototype";

export {}

type IdObj = {
    id?: Key,
}

interface MapExtension<K, V> {
    arrayMap<T>(this: Map<K, V>, cb: (val?: V, key?: K) => T): T[];
    toArray(this: Map<K, V>): V[];
    fromArray<T extends (IdObj | V)>(this: Map<K, V>, array: T[]): Map<string, T>;
    fromArray<T>(this: Map<K, V>, array: T[], keyName: string): Map<K, V>;
    fromArray2(this: Map<K, V>, array: V[], func: (item: V) => K): Map<K, V>;
    map<V2>(this: Map<K, V>, cb: (val?: V, key?: K, map?: Map<K, V>) => any): Map<K, V2>;
}

declare global {
    interface Map<K, V> extends MapExtension<K, V> {}
}

let methods: MapExtension<any, any> = {
    arrayMap<V>(this: Map<any, any>, cb: (val?: any, key?: any) => V) {
        let array: V[] = [];
        this.forEach((val, key) => array.push(cb(val, key)));
        return array;
    },
    toArray(this: Map<any, any>) {
        let array: any[] = [];
        this.forEach(val => array.push(val));
        return array;
    },
    fromArray<T extends IdObj>(this: Map<any, any>, array: T[], keyName: string = "id")  {
        this.clear();
        array.forEach(el => {
            let key = (el as any)[keyName];
            this.set(key, el);
        });
        return this;
    },
    fromArray2(this: Map<any, any>, array: any[], func: (item: any) => any)  {
        this.clear();
        array.forEach(el => this.set(func(el), el));
        return this;
    },
    map(this: Map<any, any>, cb: (val?: any, key?: any, map?: Map<any, any>) => any) {
        let map = new Map<any, any>();
        this.forEach((v, k) => map.set(k, cb(v, k, this)))
        return map;
    }
}
extendPrototype(Map.prototype, methods);