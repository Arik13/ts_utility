// import * as fs from "fs";
import { Monad } from "./Monads"
import { Primitive } from "../Types";
import { deepClone } from "../Objects";

// type Key = number | string;
type Key = string;
type Types = "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined";
interface Arg<T = any> {key: Key, val: T, parent: any}
type Predicate = (x: PathArg) => boolean;
type AnyMap = (arg: PathArg) => any;
type KeyMap = (arg: PathArg) => Key;
type PathArg = {path: Key[], key: Key, val: any, parent: any, root: any};
type PathVisitor = (arg: PathArg) => any;
interface Options {
    t?: Types,
    k?: Key,
    p?: Predicate,
    a?: boolean,    // include array
}

let pathTraverser = (arg: PathArg, visitor: PathVisitor) => {
    if (!arg.val || typeof arg.val != "object") return arg.val;

    for (let key in arg.val) {
        arg.path.push(key);
        let newArg = {
            path: arg.path,
            key,
            parent: arg.val,
            val: arg.val[key],
            root: arg.root,
        };
        visitor(newArg);
        pathTraverser(newArg, visitor);
        // if (visitor(newArg) !== "end") {
        // }
        arg.path.pop();
    }
    return arg.val;
}
// let traverser = (val: any, key: Key, parent: any, visitor: AnyMap) => {
//     visitor({val, key, parent});
//     if (typeof val == "object") {
//         for (let objKey in val) {
//             traverser(val[objKey], objKey, val, visitor);
//         }
//     }
//     return val;
// }

// let primMapper = (map: AnyMap, json: any) => {
//     return traverser(json, null, null, arg => {
//         if (typeof arg.val != "object")
//             arg.parent[arg.key] = map(arg);
//     });
// }

let renameKey = (oldKey: Key, newKey: Key, obj: any) => {
    if (oldKey == newKey) return obj;
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
}

// let keyMapper = (map: KeyMap, json: any) => {
//     Object.keys(json).forEach(key => {
//         traverser(json[key], key, json, arg => {
//             if (Array.isArray(arg.parent)) return;
//             renameKey(arg.key, map(arg), arg.parent);
//         });
//     })
//     return json;
// }
// let cloneObj = (obj: any) => JSON.parse(JSON.stringify(obj));

// let anyMapper = (map: KeyMap, json: any) => {
//     map({val: json, key: null, parent: null});
//     for (let key in json)
//         traverser(json[key], key, json, arg => arg.parent[arg.key] = map(arg));
//     return json;
// }

export class JSONMonad extends Monad<any> {
    static id = 0;
    constructor(json: any) {super(deepClone(json))}
    map(map: AnyMap) {
        return JSONMonad.new(map(this.clone()));
    }
    // traverse(visitor: AnyMap) {
    //     return JSONMonad.new(traverser(this.clone(), null, null, visitor));
    // }
    private createRootPathArg(): PathArg {
        return {root: this.clone(), val: this.clone(), path: [], key: null, parent: null};
    }
    traverse(visitor: PathVisitor) {
        return JSONMonad.new(pathTraverser(this.createRootPathArg(), visitor));
    }
    // traversePaths(visitor: PathVisitor) {
    //     return JSONMonad.new(pathTraverser(this.createRootPathArg(), visitor));
    // }
    visit(predicate: (arg: PathArg) => boolean, visitor: AnyMap) {
        return this.traverse(x => predicate(x)? visitor(x): 0);
    }
    visitKeys(key: Key, visitor: (arg: PathArg) => void) {
        return this.traverse(x => x.key == key? visitor(x) : 0);
    }
    visitOpts(opts: Options, visitor: (arg: PathArg) => void) {
        return this.traverse(x => this.optionPredicate(x, opts)? visitor(x) : 0);
    }
    filter(predicate: (arg: PathArg) => boolean) {
        return this.anyMap(x => predicate(x)? x.val : undefined);
    }
    anyMap(map: AnyMap) {
        return this.traverse(arg => arg.parent[arg.key] = map(arg));
    }
    predicateMap(predicate: (arg: PathArg) => boolean, map: AnyMap) {
        return this.anyMap(x => predicate(x)? map(x) : x.val);
    }
    primMap(map: (arg: PathArg) => Primitive) {
        return this.traverse(arg => {
            if (typeof arg.val != "object")
                arg.parent[arg.key] = map(arg);
        });
    }
    keyMap(map: KeyMap) {
        return this.traverse(arg => {
            if (Array.isArray(arg.parent)) return;
            renameKey(arg.key, map(arg), arg.parent);
        });
    }
    copyKey(oldKey: Key, newKey: Key) {
        return this.traverse(x => x.key == oldKey? x.parent[newKey] = x.val : 0)
    }
    keyValMap(key: Key, map: AnyMap) {
        return this.anyMap(x => x.key == key? map(x) : x.val);
    }
    renameKey(oldKey: Key, newKey: Key) {
        return this.keyMap(x => x.key == oldKey? newKey : x.key);
    }
    deleteKey(key: Key) {
        return this.traverse(x => x.key == key? delete x.parent[key] : 0);
    }
    typeMap(type: Types, map: AnyMap) {
        return this.anyMap(x => typeof x.val == type? map(x) : x.val);
    }
    booleanMap(map: (val: Arg<boolean>) => any) {
        return this.typeMap("boolean", map);
    }
    booleanValMap(oldVal: boolean, newVal: boolean) {
        return this.booleanMap(x => x.val === oldVal? newVal : x.val);
    }
    numberMap(map: (val: Arg<number>) => any) {
        return this.typeMap("number", map);
    }
    numberValMap(oldVal: number, newVal: number) {
        return this.numberMap(x => x.val === oldVal? newVal : x.val);
    }
    stringMap(map: (val: Arg<string>) => any) {
        return this.typeMap("string", map);
    }
    stringValMap(oldVal: string, newVal: string) {
        return this.stringMap(x => x.val === oldVal? newVal : x.val);
    }
    optMap(opts: Options, map: AnyMap) {
        if (!this.validateKey(opts.k)) throw new Error(`Invalid Key: ${opts.k}`);
        return this.predicateMap(x => this.optionPredicate(x, opts), map);
    }
    logOpts(o: Options) {
        return this.visit(x => this.optionPredicate(x, o), x => console.log(x.val));
    }
    log(pred: Predicate) {
        return this.visit(pred, x => console.log(x.val));
    }
    toArray(): any[] {
        if (Array.isArray(this.val)) {
            return this.val;
        }
        return [this.val];
    }
    private clone() {
        return deepClone(this.val);
    }
    private static new(json: any) {
        let m = new JSONMonad({});
        m.val = json;
        this.id++;
        return m;
    }
    private optionPredicate(x: PathArg, {k, t, p, a}: Options) {
        return (!k || k == x.key)
            && (!t || typeof x.val == t)
            && (!p || p(x))
            && (!a || !Array.isArray(x.parent))
    }
    private validateKey(key: Key) {
        if (typeof key != "string" && typeof key != "number" && typeof key != "undefined") {
            throw new Error(`Invalid Key: ${key}`);
        }
        return true;
    }
}