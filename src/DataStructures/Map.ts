export class Map2<U> extends Map<string, U> {
    constructor() {
        super();
    }
    arrayMap<V>(cb: (val?: U, key?: string) => V) {
        let array: V[] = [];
        this.forEach((val, key) => array.push(cb(val, key)));
        return array;
    }
    toArray() {
        let array: U[] = [];
        this.forEach(val => array.push(val));
        return array;
    }
    fromArray(array: U[], keyName?: string | "id")  {
        this.clear();
        keyName = keyName ?? "id";
        array.forEach(el => {
            let key = (el as any)[keyName];
            this.set(key, el);
        });
        return this;
    }
    fromArray2(array: U[], func: (item: U) => string)  {
        this.clear();
        // keyName = keyName ?? "id";
        array.forEach(el => {
            // let key = (el as any)[keyName];
            let key = func(el);
            this.set(key, el);
        });
        return this;
    }
}