"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Set");
const ExtendPrototype_1 = require("./ExtendPrototype");
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
    remove(pred) {
        let index = this.findIndex(pred);
        let item = this[index];
        this.splice(index, 1);
        return item;
    }
    // SET OPERATIONS
    diff(array) {
        return Array.from(new Set(this).difference(new Set(array)));
    }
    symDiff(array) {
        return Array.from(new Set(this).symmetricDifference(new Set(array)));
    }
    intersect(array) {
        return Array.from(new Set(this).intersection(new Set(array)));
    }
    union(array) {
        return Array.from(new Set(this).union(new Set(array)));
    }
    unique() {
        return Array.from(new Set(this));
    }
}
(0, ExtendPrototype_1.extendPrototypeFromClassObj)(Array.prototype, new Extension());
//# sourceMappingURL=Array.js.map