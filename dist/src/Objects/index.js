"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sizeOfObj = exports.isObject = exports.deepClone = exports.deepCopy = exports.deepEqual = void 0;
function deepEqual(object1, object2) {
    if (typeof object1 != "object" || typeof object2 != "object")
        return object1 === object2;
    if (object1 === null || object2 === null)
        return object1 === object2;
    if (!object1 || !object2)
        return false;
    let entries1 = Object.entries(object1);
    let entries2 = Object.entries(object2);
    if (entries1.length != entries2.length)
        return false;
    for (let i = 0; i < entries1.length; i++) {
        let key1 = entries1[i][0];
        let key2 = entries2[i][0];
        if (key1 != key2)
            return false;
        let val1 = entries1[i][1];
        let val2 = entries2[i][1];
        let equal = deepEqual(val1, val2);
        if (!equal)
            return false;
    }
    return true;
}
exports.deepEqual = deepEqual;
function deepCopy(obj1, obj2) {
    for (let key in obj2) {
        let el = obj2[key];
        if (el === null || el === undefined) {
            obj1[key] = el;
        }
        else if (Array.isArray(el)) {
            obj1[key] = el.map(item => JSON.parse(JSON.stringify(item)));
            ;
        }
        else if (typeof (el) == "object") {
            obj1[key] = {};
            deepCopy(obj1[key], obj2[key]);
        }
        else {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}
exports.deepCopy = deepCopy;
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
    // return deepCopy({}, obj);
}
exports.deepClone = deepClone;
function isObject(object) {
    return object != null && typeof object === 'object';
}
exports.isObject = isObject;
function sizeOfObj(obj) {
    return Buffer.byteLength(JSON.stringify(obj));
}
exports.sizeOfObj = sizeOfObj;
//# sourceMappingURL=index.js.map