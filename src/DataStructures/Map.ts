// export class Map2<U> extends Map<string, U> {
//     constructor() {
//         super();
//     }
//     arrayMap<V>(cb: (val?: U, key?: string) => V) {
//         let array: V[] = [];
//         this.forEach((val, key) => array.push(cb(val, key)));
//         return array;
//     }
//     toArray() {
//         let array: U[] = [];
//         this.forEach(val => array.push(val));
//         return array;
//     }
//     fromArray(array: U[], keyName?: string | "id")  {
//         this.clear();
//         keyName = keyName ?? "id";
//         array.forEach(el => {
//             let key = (el as any)[keyName];
//             this.set(key, el);
//         });
//         return this;
//     }
//     fromArray2(array: U[], func: (item: U) => string)  {
//         this.clear();
//         // keyName = keyName ?? "id";
//         array.forEach(el => {
//             // let key = (el as any)[keyName];
//             let key = func(el);
//             this.set(key, el);
//         });
//         return this;
//     }
// }

import { Key } from "@util/Types";
import { extendPrototype } from "./ExtendPrototype";

export {}

type IdObj = {
    id: Key,
    // [key: Key]: any,
}

interface MapExtension<K, V> {
    arrayMap<T>(this: Map<K, V>, cb: (val?: V, key?: K) => T): T[];
    toArray(this: Map<K, V>): V[];
    fromArray<T extends IdObj>(this: Map<K, V>, array: T[]): Map<string, T>;
    fromArray<T>(this: Map<K, V>, array: T[], keyName: string): Map<K, V>;
    fromArray2(this: Map<K, V>, array: V[], func: (item: V) => K): Map<K, V>;
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
    }
}
extendPrototype(Map.prototype, methods);