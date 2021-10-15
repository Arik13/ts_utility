import * as Path from "path";
import * as sourceMapSupport from "source-map-support";

type ArgType = undefined | string | (new (...args: any[]) => any)
type Con = [ArgType[] | "default", (...args: any) => void]

export let construct = <T>(
    obj: T,
    constructors: Con[],
    args: any[],
    preHook?: () => void,
    postHook?: () => void,
) => {
    !preHook ?? preHook();
    let con = constructors.find(con => argMatch(con[0], ...args))[1];

    if (con) {con.apply(obj, args);}
    else {
        throw new Err("Bad Construction");
    }
    !postHook ?? postHook();
}

let argMatch = (argTypes: string | ArgType[], ...args: any[]) => {
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
    })
}

const BLACK = "\u001b[30m";
const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const BLUE = "\u001b[34m";
const MAGENTA = "\u001b[35m";
const CYAN = "\u001b[36m";
const WHITE = "\u001b[37m";

const BRIGHT_BLACK = "\u001b[30;1m"
const BRIGHT_RED = "\u001b[31;1m"
const BRIGHT_GREEN = "\u001b[32;1m"
const BRIGHT_YELLOW = "\u001b[33;1m"
const BRIGHT_BLUE = "\u001b[34;1m"
const BRIGHT_MAGENTA = "\u001b[35;1m"
const BRIGHT_CYAN = "\u001b[36;1m"
const BRIGHT_WHITE = "\u001b[37;1m"

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

export type Constructable<T, U, V, W, X, Y, Z> = new (arg1?: U, arg2?: V, arg3?: W, arg4?: X, arg5?: Y, arg6?: Z) => T;

// If the condition is true, returns the result of the constructor with the given arguments, otherwise null
// Currently limited to up to 6 args, for which type checking is enabled
let maybe = <T, U, V, W, X, Y, Z>(
    condition: any,
    Constructor: Constructable<T, U, V, W, X, Y, Z>,
    arg1?: U, arg2?: V, arg3?: W, arg4?: X, arg5?: Y, arg6?: Z
) => {
    return condition? new Constructor(arg1, arg2, arg3, arg4, arg5, arg6) : null;
}
let ifElse = <T, U>(condition: boolean, foo: (x: any) => T, bar: (x: any) => U): (T | U) => {
    return condition? foo(null) : bar(null);
}

let testLog = (s: CallSite) => {
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
}

interface CallSite {
    getThis(): any;
    getTypeName(): string;
    getFunction(): string;
    getFunctionName(): string;
    getMethodName(): string;
    getFileName(): string;
    getLineNumber(): number;
    getColumnNumber(): number;
    getEvalOrigin(): any;
    isToplevel(): boolean;
    isEval(): boolean;
    isNative(): boolean;
    isConstructor(): boolean;
}

​const callsites = () => {
    ​const _prepareStackTrace = Error.prepareStackTrace;
    ​Error.prepareStackTrace = (_, stack) => stack.map(x => sourceMapSupport.wrapCallSite(x));
    ​const stack = new Error().stack.slice(1) as unknown as CallSite[];
    ​Error.prepareStackTrace = _prepareStackTrace;
    ​return stack;
​};

export class DebugData {
    line: number;
    col: number;
    base: string;
    dirID: string;
    constructor(line: number, col: number) {
        this.line = line;
        this.col = col;
        this.base = "";
        this.dirID = "";
    }
}

interface ParsedPath {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
}

interface TraceLineMemento {
    dir: string;
    base: string;
    name: string;
    ext: string;
    fName: string;
    cName: string;
    line: number;
    col: number;
    dirID: string;
}

class TraceLine implements ParsedPath {
    root: string;
    dir: string;
    base: string;
    name: string;
    ext: string;
    fName: string;
    cName: string;
    line: number;
    col: number;
    dirID: string;

    private CON_1() {

    }
    private CON_2(data: DebugData) {
        let split = data.base.split(".");
        this.root = "";
        this.dir = "";
        this.base = data.base ?? "";
        this.name = split[0]? split[0] : "";
        this.ext = split[1]? `.${split[1]}` : "";
        this.fName = "";
        this.cName = "";
        this.line = data.line ?? 1;
        this.col = data.col ?? 1;
        this.dirID = data.dirID;
    }
    private CON_3(data: ParsedPath, cs: CallSite) {
        let className = cs.getTypeName();
        if (className) {
            this.fName = cs.getFunctionName() ?? "<anonymous>";
            this.cName = className;
        }
        else {
            this.fName = cs.getFunctionName() ?? "";
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
    constructor();
    constructor(data: DebugData);
    constructor(data: ParsedPath, cs: CallSite);
    constructor(data?: ParsedPath | DebugData, cs?: CallSite) {
        construct(this, [
            [[undefined], this.CON_1],
            [[DebugData], this.CON_2],
            ["default", this.CON_3],
        ], [data, cs]);
    }

    setFileName(name: string) {
        if (!name) return;
        let pathData = Path.parse(name);
        this.base = pathData.base;
        this.name = pathData.name;
    }
    setPath(path: string) {
        let posixPath = path.split(Path.sep).join(Path.posix.sep);
        let pathData = Path.posix.parse(posixPath);
        this.initPathData(pathData);
    }
    pathString() {
        let dir = this.dir === undefined? "" : `${this.dir}/`;
        let docPos = this.line? `:${this.line}:${this.col}` : "";
        let ext = this.ext === undefined? "" : this.ext;
        return `${dir}${this.name}${ext}${docPos}`;
    }
    format() {
        let call = `${this.cName? `${this.cName}.` : ""}${this.fName ?? ""}`
        return {
            call: call? `at ${call} (` : "at ",
            path: this.pathString(),
            suffix: call? ")" : "",
        };
    }
    serialize(): TraceLineMemento {
        return Object.assign({}, this);
    }
    deserialize(memento: TraceLineMemento) {
        return Object.assign(this, memento);
    }
    private initPathData(data: ParsedPath) {
        this.dir = data.dir? data.dir : "";
        this.base = data.base? data.base : "";
        this.ext = data.ext? data.ext : "";
        this.name = data.name? data.name : "<anonymous>";
    }
}
interface ErrMemento {
    name: string;
    messages: string[];
    // messageString: string;
    trace: TraceLineMemento[];
    // traceString: string;
    scriptTrace: TraceLineMemento[];
    // scriptTraceString: string;
}

export class Err {
    private static readonly HEADER_COLOR = BRIGHT_WHITE;
    private static readonly TRACE_COLOR = BRIGHT_RED;
    private static readonly SCRIPT_TRACE_COLOR = BRIGHT_CYAN;
    private static readonly CALL_COLOR = BRIGHT_BLACK;
    private static readonly MESSAGE_COLOR = YELLOW;

    protected errname: string;
    protected messages: string[];
    protected messageString: string;
    protected trace: TraceLine[];
    protected traceString: string;
    protected scriptTrace: TraceLine[];
    protected scriptTraceString: string;

    name: string;
    message: string;
    stack: string;

    private CON_1() {
        this.setName("Error");
        this.buildStackTrace();
    }
    private CON_2(error: Err, message: string) {
        this.messages = error.messages;
        this.messageString = error.messageString;
        this.trace = error.trace;
        this.traceString = error.traceString;
        this.scriptTrace = error.scriptTrace;
        this.scriptTraceString = error.scriptTraceString;

        this.setName(error.name)
        // this.errname = error.name;
        this.message = error.message;
        this.stack = error.stack;

        if (message) {
            this.messages.push(message);
        }
    }
    private CON_3(error: Error, message: string) {
        this.setName(error.name);
        this.messages.push(error.message);
        if (message) {
            this.messages.push(message);
        }
        this.messages.push(error.stack);
        this.stack = error.stack;
    }
    private CON_4(error: string, message: string, debug: DebugData) {
        this.setName(error);
        this.messages.push(message);
        this.buildStackTrace();
        if (debug) {
            this.scriptTrace.push(new TraceLine(debug));
        }
    }
    constructor();
    constructor(error: Err, message?: string);
    constructor(error: Error | unknown, message?: string);
    constructor(error: string, message?: string, debug?: DebugData);
    constructor(error?: Err | string | Error | unknown | ErrMemento, message?: string, debug?: DebugData) {
        let createProperty = (value: any) => ({enumerable: false, configurable: true, writable: true, value})
        Object.defineProperties(this, {
            errname: createProperty(""),
            messages: createProperty([]),
            messageString: createProperty(""),
            trace: createProperty([]),
            traceString: createProperty(""),
            scriptTrace: createProperty([]),
            scriptTraceString: createProperty(""),
        });
        construct(this, [
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
    buildStackTrace() {
        this.trace = callsites().map(cs => {
            let fileName = cs.getFileName();
            if (!fileName) {
                return maybe(cs.getFunctionName(), TraceLine, null, cs);
            }
            let posixPath = fileName.split(Path.sep).join(Path.posix.sep);
            let pathData = Path.posix.parse(posixPath);
            if (IGNORE_DIRS.includes(pathData.dir)) return null;
            if (IGNORE_FILES.includes(pathData.base)) return null;
            pathData.dir = `./${Path.posix.relative(ROOT, pathData.dir)}`;
            return new TraceLine(pathData, cs);
        }).filter(x => x && !["Err", "Assert"].includes(x.cName));
    }
    setName(name: string) {
        this.errname = name;
        this.name = `${BRIGHT_WHITE}${name}${RESET}`;
        return this;
    }
    addScriptData(debug: DebugData) {
        this.scriptTrace.push(new TraceLine(debug));
        this.genScriptTraceString();
        this.updateOutput();
        return this;
    }
    addMessage(message: string) {
        this.messages.push(message);
        this.updateMessage();
        return this;
    }
    forEachTraceLine(handler: (l: TraceLine) => void) {
        this.scriptTrace.forEach(l => handler(l));
        this.updateScriptTrace();
        return this;
    }
    serialize(): ErrMemento {
        return {
            name: this.errname,
            messages: this.messages,
            trace: [],
            scriptTrace: this.scriptTrace.map(t => t.serialize()),
        }
    }
    deserialize(memento: ErrMemento) {
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
    private updateMessage() {
        this.genMessageString();
        this.updateOutput();
    }
    private updateTrace() {
        this.genScriptTraceString()
        this.updateOutput();
    }
    private updateScriptTrace() {
        this.genScriptTraceString()
        this.updateOutput();
    }
    private genMessageString() {
        this.messageString = `\n${Err.MESSAGE_COLOR}${this.messages.map(m => `    ${m}`).join("\n")}${RESET}`;
    }
    private formatTrace(trace: TraceLine[], headerStr: string, headerClr: string, pathClr: string, callClr: string) {
        let toTraceString = (line: TraceLine) => {
            let {call, path, suffix} = line.format();
            return `    ${callClr}${call}${RESET}${pathClr}${path}${RESET}${callClr}${suffix}${RESET}\n`;
        };
        let header = `${headerClr}${headerStr}${RESET}\n`
        let traceBody = trace.map(x => toTraceString(x)).join("");
        return `${header}${traceBody}${RESET}`;
    }
    private genTraceString() {
        this.traceString = this.formatTrace(this.trace, "COMPILER TRACE", Err.HEADER_COLOR, Err.TRACE_COLOR, Err.CALL_COLOR);
    }
    private genScriptTraceString() {
        this.scriptTraceString = this.formatTrace(this.scriptTrace, "SCRIPT TRACE", Err.HEADER_COLOR, Err.SCRIPT_TRACE_COLOR, Err.CALL_COLOR);
    }
    private updateOutput() {
        this.stack = `${Err.line()}\n${this.traceString}\n${this.scriptTraceString}`
        this.message = `${this.messageString}\n${Err.line()}`;
    }
    private static line() {
        return "______________________________________________________________\n";
    }
}