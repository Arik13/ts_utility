"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONMonad = void 0;
// import * as fs from "fs";
const Monads_1 = require("./Monads");
let pathTraverser = (arg, visitor) => {
    if (!arg.val || typeof arg.val != "object")
        return arg.val;
    for (let key in arg.val) {
        arg.path.push(key);
        let newArg = {
            path: arg.path,
            key,
            parent: arg.val,
            val: arg.val[key],
            root: arg.root,
        };
        if (visitor(newArg) !== "end") {
            pathTraverser(newArg, visitor);
        }
        arg.path.pop();
    }
    return arg.val;
};
let traverser = (val, key, parent, visitor) => {
    visitor({ val, key, parent });
    if (typeof val == "object") {
        for (let objKey in val) {
            traverser(val[objKey], objKey, val, visitor);
        }
    }
    return val;
};
let primMapper = (map, json) => {
    return traverser(json, null, null, arg => {
        if (typeof arg.val != "object")
            arg.parent[arg.key] = map(arg);
    });
};
let renameKey = (oldKey, newKey, obj) => {
    if (oldKey == newKey)
        return obj;
    Object.keys(obj).forEach(key => {
        if (key == oldKey) {
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
        }
        else {
            let val = obj[key];
            delete obj[key];
            obj[key] = val;
        }
    });
    return obj;
};
let keyMapper = (map, json) => {
    Object.keys(json).forEach(key => {
        traverser(json[key], key, json, arg => {
            if (Array.isArray(arg.parent))
                return;
            renameKey(arg.key, map(arg), arg.parent);
        });
    });
    return json;
};
let cloneObj = (obj) => JSON.parse(JSON.stringify(obj));
let anyMapper = (map, json) => {
    map({ val: json, key: null, parent: null });
    for (let key in json)
        traverser(json[key], key, json, arg => arg.parent[arg.key] = map(arg));
    return json;
};
class JSONMonad extends Monads_1.Monad {
    constructor(json) { super(cloneObj(json)); }
    map(map) {
        return JSONMonad.new(map(this.clone()));
    }
    traverse(visitor) {
        return JSONMonad.new(traverser(this.clone(), null, null, visitor));
    }
    traversePaths(visitor) {
        return JSONMonad.new(pathTraverser({ root: this.clone(), val: this.clone(), path: [], key: null, parent: null }, visitor));
    }
    visit(predicate, visitor) {
        return this.traverse(x => predicate(x) ? visitor(x) : 0);
    }
    visitKeys(key, visitor) {
        return this.traverse(x => x.key == key ? visitor(x) : 0);
    }
    visitOpts(opts, visitor) {
        return this.traverse(x => this.optionPredicate(x, opts) ? visitor(x) : 0);
    }
    filter(predicate) {
        return this.anyMap(x => predicate(x) ? x.val : undefined);
    }
    anyMap(map) {
        return JSONMonad.new(anyMapper(map, this.clone()));
    }
    predicateMap(predicate, map) {
        return this.anyMap(x => predicate(x) ? map(x) : x.val);
    }
    primMap(map) {
        return JSONMonad.new(primMapper(map, this.clone()));
    }
    keyMap(map) {
        return JSONMonad.new(keyMapper(map, this.clone()));
    }
    copyKey(oldKey, newKey) {
        return this.traverse(x => x.key == oldKey ? x.parent[newKey] = x.val : 0);
    }
    keyValMap(key, map) {
        return this.anyMap(x => x.key == key ? map(x) : x.val);
    }
    renameKey(oldKey, newKey) {
        return this.keyMap(x => x.key == oldKey ? newKey : x.key);
    }
    deleteKey(key) {
        return this.traverse(x => x.key == key ? delete x.parent[key] : 0);
    }
    typeMap(type, map) {
        return this.anyMap(x => typeof x.val == type ? map(x) : x.val);
    }
    booleanMap(map) {
        return this.typeMap("boolean", map);
    }
    booleanValMap(oldVal, newVal) {
        return this.booleanMap(x => x.val === oldVal ? newVal : x.val);
    }
    numberMap(map) {
        return this.typeMap("number", map);
    }
    numberValMap(oldVal, newVal) {
        return this.numberMap(x => x.val === oldVal ? newVal : x.val);
    }
    stringMap(map) {
        return this.typeMap("string", map);
    }
    stringValMap(oldVal, newVal) {
        return this.stringMap(x => x.val === oldVal ? newVal : x.val);
    }
    optMap(opts, map) {
        if (!this.validateKey(opts.k))
            throw new Error(`Invalid Key: ${opts.k}`);
        return this.predicateMap(x => this.optionPredicate(x, opts), map);
    }
    logOpts(o) {
        return this.visit(x => this.optionPredicate(x, o), x => console.log(x.val));
    }
    log(pred) {
        return this.visit(pred, x => console.log(x.val));
    }
    toArray() {
        if (Array.isArray(this.val)) {
            return this.val;
        }
        return [this.val];
    }
    clone() {
        return cloneObj(this.val);
    }
    static new(json) {
        let m = new JSONMonad({});
        m.val = json;
        this.id++;
        return m;
    }
    optionPredicate(x, { k, t, p, a }) {
        return (!k || k == x.key)
            && (!t || typeof x.val == t)
            && (!p || p(x))
            && (!a || !Array.isArray(x.parent));
    }
    validateKey(key) {
        if (typeof key != "string" && typeof key != "number" && typeof key != "undefined") {
            throw new Error(`Invalid Key: ${key}`);
        }
        return true;
    }
}
exports.JSONMonad = JSONMonad;
JSONMonad.id = 0;
//# sourceMappingURL=JSONMonad.js.map