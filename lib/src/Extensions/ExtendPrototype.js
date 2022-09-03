"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendPrototypeFromClassObj = exports.extendPrototype = void 0;
let extendPrototype = (prototype, methods) => {
    var _a;
    for (let key in methods) {
        if (prototype.hasOwnProperty(key)) {
            throw new Error(`${(_a = prototype.constructor) === null || _a === void 0 ? void 0 : _a.name} already has property ${key}`);
        }
        Object.defineProperty(prototype, key, {
            value: methods[key],
            enumerable: false,
        });
    }
};
exports.extendPrototype = extendPrototype;
let extendPrototypeFromClassObj = (prototype, obj) => {
    let objProto = Object.getPrototypeOf(obj);
    let methods = Object.getOwnPropertyNames(objProto).slice(1).map(k => [k, objProto[k]]);
    let methodObject = Object.fromEntries(methods);
    (0, exports.extendPrototype)(prototype, methodObject);
    (0, exports.extendPrototype)(prototype, obj);
};
exports.extendPrototypeFromClassObj = extendPrototypeFromClassObj;
//# sourceMappingURL=ExtendPrototype.js.map