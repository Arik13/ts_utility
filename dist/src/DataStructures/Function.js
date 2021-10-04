"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Set");
const ExtendPrototype_1 = require("./ExtendPrototype");
let prims = ["string", "number", "boolean"];
let functionMethods = {
    get _() {
        return "testing";
    }
};
(0, ExtendPrototype_1.extendPrototype)(Function.prototype, functionMethods);
//# sourceMappingURL=Function.js.map