"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendPrototype_1 = require("./ExtendPrototype");
class Extension {
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
    fromArray(array, keyName = "id") {
        this.clear();
        array.forEach(el => {
            let key = el[keyName];
            this.set(key, el);
        });
        return this;
    }
    fromArray2(array, func) {
        this.clear();
        array.forEach(el => this.set(func(el), el));
        return this;
    }
    map(cb) {
        let map = new Map();
        this.forEach((v, k) => map.set(k, cb(v, k, this)));
        return map;
    }
}
;
(0, ExtendPrototype_1.extendPrototypeFromClassObj)(Map.prototype, new Extension());
//# sourceMappingURL=Map.js.map