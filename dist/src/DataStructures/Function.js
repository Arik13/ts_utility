"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendPrototype_1 = require("./ExtendPrototype");
class Extension {
    _(func) {
        return (...args) => func(this(...args));
    }
}
(0, ExtendPrototype_1.extendPrototypeFromClassObj)(Function.prototype, new Extension());
//# sourceMappingURL=Function.js.map