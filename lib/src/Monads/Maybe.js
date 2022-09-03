"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const Monads_1 = require("./Monads");
class Maybe extends Monads_1.Monad {
    constructor(value) {
        super(value ? Maybe.getWrappedVal(value) : []);
        this.condition = true;
    }
    // @ts-ignore
    map(func) {
        return Maybe.init(func(this.getValue()), this.condition);
    }
    flatMap(func) {
        return func(this.getValue());
    }
    if(arg, predicate) {
        if (this.validate(arg, predicate))
            return Maybe.init(arg, true);
        return Maybe.init(null, false);
    }
    elseIf(arg, predicate) {
        if (this.condition)
            return Maybe.init(this.getValue(), false);
        return this.if(arg, predicate);
    }
    else() {
        return Maybe.init(this.getValue(), !this.condition);
    }
    then(func) {
        if (this.condition) {
            let arg = func(this.getValue());
            return Maybe.init(arg, this.condition);
        }
        return this;
    }
    return() {
        return Maybe.isValid(this.val[0]) ? this.val[0] : [];
    }
    getValue() {
        return this.val[0];
    }
    static maybe(arg, f, p) {
        return Maybe.isValid(arg) ? f(arg, p) : [];
    }
    validate(arg, predicate) {
        return Maybe.isValid(arg) && (!predicate || predicate(arg));
    }
    set(val) {
        this.val = val;
        return this;
    }
    static isValid(val) {
        return !(Array.isArray(val) && !val.length || !val);
    }
    static getWrappedVal(val) {
        return Maybe.isValid(val) ? [val] : [];
    }
    static init(val, condition) {
        let m = new Maybe().set(Maybe.getWrappedVal(val));
        m.condition = condition;
        return m;
    }
}
exports.Maybe = Maybe;
//# sourceMappingURL=Maybe.js.map