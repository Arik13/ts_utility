import { Monad } from "./Monads";
import { Primitive } from "../Types";
declare type Key = number | string;
declare type Types = "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined";
interface Arg<T = any> {
    key: Key;
    val: T;
    parent: any;
}
declare type Predicate = (x: Arg) => boolean;
declare type AnyMap = (arg: Arg) => any;
declare type KeyMap = (arg: Arg) => Key;
interface Options {
    t?: Types;
    k?: Key;
    p?: Predicate;
    a?: boolean;
}
export declare class JSONMonad extends Monad<any> {
    static id: number;
    constructor(json: any);
    map(map: AnyMap): JSONMonad;
    traverse(visitor: AnyMap): JSONMonad;
    visit(predicate: (arg: Arg) => boolean, visitor: AnyMap): JSONMonad;
    visitKeys(key: Key, visitor: (arg: Arg) => void): JSONMonad;
    visitOpts(opts: Options, visitor: (arg: Arg) => void): JSONMonad;
    filter(predicate: (arg: Arg) => boolean): JSONMonad;
    anyMap(map: AnyMap): JSONMonad;
    predicateMap(predicate: (arg: Arg) => boolean, map: AnyMap): JSONMonad;
    primMap(map: (arg: Arg<Primitive>) => Primitive): JSONMonad;
    keyMap(map: KeyMap): JSONMonad;
    copyKey(oldKey: Key, newKey: Key): JSONMonad;
    keyValMap(key: Key, map: AnyMap): JSONMonad;
    renameKey(oldKey: Key, newKey: Key): JSONMonad;
    deleteKey(key: Key): JSONMonad;
    typeMap<T>(type: Types, map: AnyMap): JSONMonad;
    booleanMap(map: (val: Arg<boolean>) => any): JSONMonad;
    booleanValMap(oldVal: boolean, newVal: boolean): JSONMonad;
    numberMap(map: (val: Arg<number>) => any): JSONMonad;
    numberValMap(oldVal: number, newVal: number): JSONMonad;
    stringMap(map: (val: Arg<string>) => any): JSONMonad;
    stringValMap(oldVal: string, newVal: string): JSONMonad;
    optMap(opts: Options, map: AnyMap): JSONMonad;
    logOpts(o: Options): JSONMonad;
    log(pred: Predicate): JSONMonad;
    toArray(): any[];
    private clone;
    private static new;
    private optionPredicate;
    private validateKey;
}
export {};
