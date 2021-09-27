"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendPrototype = void 0;
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
//# sourceMappingURL=ExtendPrototype.js.map