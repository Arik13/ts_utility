"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringMonad = exports.NumberMonad = exports.Monad = void 0;
class Monad {
    constructor(val) {
        this.val = val;
    }
    return() {
        return this.val;
    }
}
exports.Monad = Monad;
class NumberMonad extends Monad {
    constructor(val) {
        super(val);
    }
    map(func) {
        return new NumberMonad(func(this.val));
    }
    toStrMonad(func) {
        let str = func ? func(this.val) : String(this.val);
        return new StringMonad(str);
    }
}
exports.NumberMonad = NumberMonad;
class StringMonad extends Monad {
    constructor(val) {
        super(typeof val == "number" ? String(val) : val);
    }
    map(func) {
        return new StringMonad(func(this.val));
    }
}
exports.StringMonad = StringMonad;
//# sourceMappingURL=Monads.js.map