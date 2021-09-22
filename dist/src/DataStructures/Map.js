"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map2 = void 0;
class Map2 extends Map {
    constructor() {
        super();
    }
    arrayMap(cb) {
        let array = [];
        this.forEach((val, key) => array.push(cb(val, key)));
        return array;
    }
    toArray() {
        let array = [];
        this.forEach(val => array.push(val));
        return array;
    }
    fromArray(array, keyName) {
        this.clear();
        keyName = keyName !== null && keyName !== void 0 ? keyName : "id";
        array.forEach(el => {
            let key = el[keyName];
            this.set(key, el);
        });
        return this;
    }
    fromArray2(array, func) {
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
exports.Map2 = Map2;
//# sourceMappingURL=Map.js.map