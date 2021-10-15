"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.DebugData = exports.construct = void 0;
const Path = require("path");
const sourceMapSupport = require("source-map-support");
let construct = (obj, constructors, args, preHook, postHook) => {
    var _a, _b;
    (_a = !preHook) !== null && _a !== void 0 ? _a : preHook();
    let con = constructors.find(con => argMatch(con[0], ...args))[1];
    if (con) {
        con.apply(obj, args);
    }
    else {
        throw new Err("Bad Construction");
    }
    (_b = !postHook) !== null && _b !== void 0 ? _b : postHook();
};
exports.construct = construct;
let argMatch = (argTypes, ...args) => {
    if (typeof argTypes === "string") {
        return argTypes == "default";
    }
    return argTypes.every((argType, i) => {
        if (argType === undefined) {
            return args[i] === undefined;
        }
        else if (typeof argType === "string") {
            return typeof args[i] === argType;
        }
        else {
            return args[i] instanceof argType;
        }
    });
};
const BLACK = "\u001b[30m";
const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const BLUE = "\u001b[34m";
const MAGENTA = "\u001b[35m";
const CYAN = "\u001b[36m";
const WHITE = "\u001b[37m";
const BRIGHT_BLACK = "\u001b[30;1m";
const BRIGHT_RED = "\u001b[31;1m";
const BRIGHT_GREEN = "\u001b[32;1m";
const BRIGHT_YELLOW = "\u001b[33;1m";
const BRIGHT_BLUE = "\u001b[34;1m";
const BRIGHT_MAGENTA = "\u001b[35;1m";
const BRIGHT_CYAN = "\u001b[36;1m";
const BRIGHT_WHITE = "\u001b[37;1m";
const RESET = "\u001b[0m";
const ROOT = "C:/Users/Arik/Home/Code/Javascript/vtt_app/vtt_server";
const IGNORE_DIRS = [
    "internal/main",
    "internal/modules",
    "internal/modules/cjs",
    "C:/Users/Arik/AppData/Local/Temp",
];
const IGNORE_FILES = [
    "source-map-support.js",
    "wrap.js",
    "hook.js",
    "app.ts",
    "Err.ts",
    "Asserts.ts",
];
// If the condition is true, returns the result of the constructor with the given arguments, otherwise null
// Currently limited to up to 6 args, for which type checking is enabled
let maybe = (condition, Constructor, arg1, arg2, arg3, arg4, arg5, arg6) => {
    return condition ? new Constructor(arg1, arg2, arg3, arg4, arg5, arg6) : null;
};
let ifElse = (condition, foo, bar) => {
    return condition ? foo(null) : bar(null);
};
let testLog = (s) => {
    console.log("getFileName:", s.getFileName());
    console.log("getTypeName:", s.getTypeName());
    console.log("getFunction:", s.getFunction());
    console.log("getFunctionName:", s.getFunctionName());
    console.log("getMethodName:", s.getMethodName());
    console.log("getFileName:", s.getFileName());
    console.log("getLineNumber:", s.getLineNumber());
    console.log("getColumnNumber:", s.getColumnNumber());
    console.log("getEvalOrigin:", s.getEvalOrigin());
    console.log("isTopLevel:", s.isToplevel());
    console.log("isEval:", s.isEval());
    console.log("isNative:", s.isNative());
    console.log("isConstructor:", s.isConstructor());
    console.log("-----------------------------------------------");
};
const callsites = () => {
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack.map(x => sourceMapSupport.wrapCallSite(x));
    const stack = new Error().stack.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;
    return stack;
};
class DebugData {
    constructor(line, col) {
        this.line = line;
        this.col = col;
        this.base = "";
        this.dirID = "";
    }
}
exports.DebugData = DebugData;
class TraceLine {
    constructor(data, cs) {
        (0, exports.construct)(this, [
            [[undefined], this.CON_1],
            [[DebugData], this.CON_2],
            ["default", this.CON_3],
        ], [data, cs]);
    }
    CON_1() {
    }
    CON_2(data) {
        var _a, _b, _c;
        let split = data.base.split(".");
        this.root = "";
        this.dir = "";
        this.base = (_a = data.base) !== null && _a !== void 0 ? _a : "";
        this.name = split[0] ? split[0] : "";
        this.ext = split[1] ? `.${split[1]}` : "";
        this.fName = "";
        this.cName = "";
        this.line = (_b = data.line) !== null && _b !== void 0 ? _b : 1;
        this.col = (_c = data.col) !== null && _c !== void 0 ? _c : 1;
        this.dirID = data.dirID;
    }
    CON_3(data, cs) {
        var _a, _b;
        let className = cs.getTypeName();
        if (className) {
            this.fName = (_a = cs.getFunctionName()) !== null && _a !== void 0 ? _a : "<anonymous>";
            this.cName = className;
        }
        else {
            this.fName = (_b = cs.getFunctionName()) !== null && _b !== void 0 ? _b : "";
            this.cName = "";
        }
        this.line = cs.getLineNumber();
        this.col = cs.getColumnNumber();
        if (data === null) {
            this.name = "<anonymous>";
        }
        else {
            this.initPathData(data);
        }
    }
    setFileName(name) {
        if (!name)
            return;
        let pathData = Path.parse(name);
        this.base = pathData.base;
        this.name = pathData.name;
    }
    setPath(path) {
        let posixPath = path.split(Path.sep).join(Path.posix.sep);
        let pathData = Path.posix.parse(posixPath);
        this.initPathData(pathData);
    }
    pathString() {
        let dir = this.dir === undefined ? "" : `${this.dir}/`;
        let docPos = this.line ? `:${this.line}:${this.col}` : "";
        let ext = this.ext === undefined ? "" : this.ext;
        return `${dir}${this.name}${ext}${docPos}`;
    }
    format() {
        var _a;
        let call = `${this.cName ? `${this.cName}.` : ""}${(_a = this.fName) !== null && _a !== void 0 ? _a : ""}`;
        return {
            call: call ? `at ${call} (` : "at ",
            path: this.pathString(),
            suffix: call ? ")" : "",
        };
    }
    serialize() {
        return Object.assign({}, this);
    }
    deserialize(memento) {
        return Object.assign(this, memento);
    }
    initPathData(data) {
        this.dir = data.dir ? data.dir : "";
        this.base = data.base ? data.base : "";
        this.ext = data.ext ? data.ext : "";
        this.name = data.name ? data.name : "<anonymous>";
    }
}
class Err {
    constructor(error, message, debug) {
        let createProperty = (value) => ({ enumerable: false, configurable: true, writable: true, value });
        Object.defineProperties(this, {
            errname: createProperty(""),
            messages: createProperty([]),
            messageString: createProperty(""),
            trace: createProperty([]),
            traceString: createProperty(""),
            scriptTrace: createProperty([]),
            scriptTraceString: createProperty(""),
        });
        (0, exports.construct)(this, [
            [[undefined], this.CON_1],
            [[Err], this.CON_2],
            [[Error], this.CON_3],
            [["string"], this.CON_4],
            // [["default"], this.CON_5],
        ], [error, message, debug]);
        this.genMessageString();
        this.genTraceString();
        this.genScriptTraceString();
        this.updateOutput();
    }
    CON_1() {
        this.setName("Error");
        this.buildStackTrace();
    }
    CON_2(error, message) {
        this.messages = error.messages;
        this.messageString = error.messageString;
        this.trace = error.trace;
        this.traceString = error.traceString;
        this.scriptTrace = error.scriptTrace;
        this.scriptTraceString = error.scriptTraceString;
        this.setName(error.name);
        // this.errname = error.name;
        this.message = error.message;
        this.stack = error.stack;
        if (message) {
            this.messages.push(message);
        }
    }
    CON_3(error, message) {
        this.setName(error.name);
        this.messages.push(error.message);
        if (message) {
            this.messages.push(message);
        }
        this.messages.push(error.stack);
        this.stack = error.stack;
    }
    CON_4(error, message, debug) {
        this.setName(error);
        this.messages.push(message);
        this.buildStackTrace();
        if (debug) {
            this.scriptTrace.push(new TraceLine(debug));
        }
    }
    buildStackTrace() {
        this.trace = callsites().map(cs => {
            let fileName = cs.getFileName();
            if (!fileName) {
                return maybe(cs.getFunctionName(), TraceLine, null, cs);
            }
            let posixPath = fileName.split(Path.sep).join(Path.posix.sep);
            let pathData = Path.posix.parse(posixPath);
            if (IGNORE_DIRS.includes(pathData.dir))
                return null;
            if (IGNORE_FILES.includes(pathData.base))
                return null;
            pathData.dir = `./${Path.posix.relative(ROOT, pathData.dir)}`;
            return new TraceLine(pathData, cs);
        }).filter(x => x && !["Err", "Assert"].includes(x.cName));
    }
    setName(name) {
        this.errname = name;
        this.name = `${BRIGHT_WHITE}${name}${RESET}`;
        return this;
    }
    addScriptData(debug) {
        this.scriptTrace.push(new TraceLine(debug));
        this.genScriptTraceString();
        this.updateOutput();
        return this;
    }
    addMessage(message) {
        this.messages.push(message);
        this.updateMessage();
        return this;
    }
    forEachTraceLine(handler) {
        this.scriptTrace.forEach(l => handler(l));
        this.updateScriptTrace();
        return this;
    }
    serialize() {
        return {
            name: this.errname,
            messages: this.messages,
            trace: [],
            scriptTrace: this.scriptTrace.map(t => t.serialize()),
        };
    }
    deserialize(memento) {
        this.setName(memento.name);
        this.messages = memento.messages;
        this.trace = memento.trace.map(t => new TraceLine().deserialize(t));
        this.scriptTrace = memento.scriptTrace.map(t => new TraceLine().deserialize(t));
        this.genMessageString();
        this.genTraceString();
        this.genScriptTraceString();
        this.updateOutput();
        return this;
    }
    toStdError() {
        let error = new Error();
        error.name = this.name;
        error.message = this.message;
        error.stack = this.stack;
        return error;
    }
    updateMessage() {
        this.genMessageString();
        this.updateOutput();
    }
    updateTrace() {
        this.genScriptTraceString();
        this.updateOutput();
    }
    updateScriptTrace() {
        this.genScriptTraceString();
        this.updateOutput();
    }
    genMessageString() {
        this.messageString = `\n${Err.MESSAGE_COLOR}${this.messages.map(m => `    ${m}`).join("\n")}${RESET}`;
    }
    formatTrace(trace, headerStr, headerClr, pathClr, callClr) {
        let toTraceString = (line) => {
            let { call, path, suffix } = line.format();
            return `    ${callClr}${call}${RESET}${pathClr}${path}${RESET}${callClr}${suffix}${RESET}\n`;
        };
        let header = `${headerClr}${headerStr}${RESET}\n`;
        let traceBody = trace.map(x => toTraceString(x)).join("");
        return `${header}${traceBody}${RESET}`;
    }
    genTraceString() {
        this.traceString = this.formatTrace(this.trace, "COMPILER TRACE", Err.HEADER_COLOR, Err.TRACE_COLOR, Err.CALL_COLOR);
    }
    genScriptTraceString() {
        this.scriptTraceString = this.formatTrace(this.scriptTrace, "SCRIPT TRACE", Err.HEADER_COLOR, Err.SCRIPT_TRACE_COLOR, Err.CALL_COLOR);
    }
    updateOutput() {
        this.stack = `${Err.line()}\n${this.traceString}\n${this.scriptTraceString}`;
        this.message = `${this.messageString}\n${Err.line()}`;
    }
    static line() {
        return "______________________________________________________________\n";
    }
}
exports.Err = Err;
Err.HEADER_COLOR = BRIGHT_WHITE;
Err.TRACE_COLOR = BRIGHT_RED;
Err.SCRIPT_TRACE_COLOR = BRIGHT_CYAN;
Err.CALL_COLOR = BRIGHT_BLACK;
Err.MESSAGE_COLOR = YELLOW;
//# sourceMappingURL=Err.js.map