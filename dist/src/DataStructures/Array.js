"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Set");
const ExtendPrototype_1 = require("./ExtendPrototype");
let prims = ["string", "number", "boolean"];
class ArraySetData {
    constructor(array) {
        this.array = array;
        this.keys = array.map(x => x.id);
        this.indexDict = Object.fromEntries(this.keys.map((x, i) => [x, i]));
    }
    toSet() {
        return new Set(this.keys);
    }
    get(key) {
        return this.array[this.indexDict[key]];
    }
}
class Extension {
    cross(array) {
        let cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
        return cartesian(this, array);
    }
    merge(array) {
        if (this.length != array.length)
            throw new Error("Cannot merge arrays of unequal length!");
        return this.map((x, i) => [x, array[i]]);
    }
    equals(b, pred) {
        if (this.length != b.length)
            return false;
        let p = pred !== null && pred !== void 0 ? pred : ((a, b) => a === b);
        for (let i = 0; i < this.length; i++) {
            if (!p(this[i], b[i]))
                return false;
        }
        return true;
    }
    // SET OPERATIONS
    diff(array) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).difference(new Set(array)));
        }
        else {
            let a = new ArraySetData(this);
            let b = new ArraySetData(array);
            let diffSet = a.toSet().difference(b.toSet());
            return Array.from(diffSet).map(x => { var _a; return (_a = a.get(x)) !== null && _a !== void 0 ? _a : b.get(x); });
        }
    }
    symDiff(array) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).symmetricDifference(new Set(array)));
        }
        else {
            let a = new ArraySetData(this);
            let b = new ArraySetData(array);
            let diffSet = a.toSet().symmetricDifference(b.toSet());
            return Array.from(diffSet).map(x => { var _a; return (_a = a.get(x)) !== null && _a !== void 0 ? _a : b.get(x); });
        }
    }
    intersect(array) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).intersection(new Set(array)));
        }
        else {
            let a = new ArraySetData(this);
            let b = new ArraySetData(array);
            let diffSet = a.toSet().intersection(b.toSet());
            return Array.from(diffSet).map(x => { var _a; return (_a = a.get(x)) !== null && _a !== void 0 ? _a : b.get(x); });
        }
    }
    union(array) {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this).union(new Set(array)));
        }
        else {
            let a = new ArraySetData(this);
            let b = new ArraySetData(array);
            let diffSet = a.toSet().union(b.toSet());
            return Array.from(diffSet).map(x => { var _a; return (_a = a.get(x)) !== null && _a !== void 0 ? _a : b.get(x); });
        }
    }
    unique() {
        if (this[0] && prims.includes(typeof this[0]) || this[1] && prims.includes(typeof this[1])) {
            return Array.from(new Set(this));
        }
        else {
            let a = new ArraySetData(this);
            return Array.from(a.toSet()).map(x => a.get(x));
        }
    }
}
(0, ExtendPrototype_1.extendPrototypeFromClassObj)(Array.prototype, new Extension());
//# sourceMappingURL=Array.js.map