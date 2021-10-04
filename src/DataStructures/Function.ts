export {}
import "./Set";
import { Primitive } from "../Types";
import { extendPrototype } from "./ExtendPrototype";
let prims = ["string", "number", "boolean"];

let functionMethods = {
    get _() {
        return "testing";
    }
}

type FunctionExtension = typeof functionMethods;

declare global {
    interface Function extends FunctionExtension {}
}

extendPrototype(Function.prototype, functionMethods);