"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendPrototype_1 = require("./ExtendPrototype");
let methods = {
    isSuperset(subset) {
        for (let elem of subset) {
            if (!this.has(elem)) {
                return false;
            }
        }
        return true;
    },
    union(setB) {
        let union = new Set(this);
        for (let elem of setB) {
            union.add(elem);
        }
        return union;
    },
    intersection(setB) {
        let intersection = new Set();
        for (let elem of setB) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    },
    symmetricDifference(setB) {
        let difference = new Set(this);
        for (let elem of setB) {
            if (difference.has(elem)) {
                difference.delete(elem);
            }
            else {
                difference.add(elem);
            }
        }
        return difference;
    },
    difference(setB) {
        let difference = new Set(this);
        for (let elem of setB) {
            difference.delete(elem);
        }
        return difference;
    }
};
(0, ExtendPrototype_1.extendPrototype)(Set.prototype, methods);
//# sourceMappingURL=Set.js.map