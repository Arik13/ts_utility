import { Key } from "../Types";
import { extendPrototypeFromClassObj } from "./ExtendPrototype";

export {}

type IdObj = {
    id?: Key,
}

class Extension<K, V> {
    arrayMap<T>(this: Map<K, V>, cb: (val?: V, key?: K) => T) {
        let array: T[] = [];
        this.forEach((val, key) => array.push(cb(val, key)));
        return array;
    }
    toArray(this: Map<K, V>) {
        let array: V[] = [];
        this.forEach(val => array.push(val));
        return array;
    }
    fromArray<T extends IdObj & V>(this: Map<K, V>, array: T[], keyName: string = "id") {
        this.clear();
        array.forEach(el => {
            let key = (el as any)[keyName];
            this.set(key, el);
        });
        return this;
    }
    fromArray2(this: Map<K, V>, array: V[], func: (item: V) => K)  {
        this.clear();
        array.forEach(el => this.set(func(el), el));
        return this;
    }
    map<V2>(this: Map<K, V>, cb: (val?: V, key?: K, map?: Map<K, V>) => any) {
        let map = new Map<K, V2>();
        this.forEach((v, k) => map.set(k, cb(v, k, this)))
        return map;
    }
};

declare global {
    interface Map<K, V> extends Extension<K, V> {}
}
extendPrototypeFromClassObj(Map.prototype, new Extension());