declare type ArgType = undefined | string | (new (...args: any[]) => any);
declare type Con = [ArgType[] | "default", (...args: any) => void];
export declare let construct: <T>(obj: T, constructors: Con[], args: any[], preHook?: () => void, postHook?: () => void) => void;
export declare type Constructable<T, U, V, W, X, Y, Z> = new (arg1?: U, arg2?: V, arg3?: W, arg4?: X, arg5?: Y, arg6?: Z) => T;
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
export declare class DebugData {
    line: number;
    col: number;
    base: string;
    dirID: string;
    constructor(line: number, col: number);
}
export interface ParsedPath {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
}
export interface TraceLineMemento {
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
export declare class TraceLine implements ParsedPath {
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
    private CON_1;
    private CON_2;
    private CON_3;
    constructor();
    constructor(data: DebugData);
    constructor(data: ParsedPath, cs: CallSite);
    setFileName(name: string): void;
    setPath(path: string): void;
    pathString(): string;
    format(): {
        call: string;
        path: string;
        suffix: string;
    };
    serialize(): TraceLineMemento;
    deserialize(memento: TraceLineMemento): this & TraceLineMemento;
    private initPathData;
}
export interface ErrMemento {
    name: string;
    messages: string[];
    trace: TraceLineMemento[];
    scriptTrace: TraceLineMemento[];
}
export declare class Err {
    private static readonly HEADER_COLOR;
    private static readonly TRACE_COLOR;
    private static readonly SCRIPT_TRACE_COLOR;
    private static readonly CALL_COLOR;
    private static readonly MESSAGE_COLOR;
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
    private CON_1;
    private CON_2;
    private CON_3;
    private CON_4;
    constructor();
    constructor(error: Err, message?: string);
    constructor(error: Error | unknown, message?: string);
    constructor(error: string, message?: string, debug?: DebugData);
    buildStackTrace(): void;
    setName(name: string): this;
    addScriptData(debug: DebugData): this;
    addMessage(message: string): this;
    forEachTraceLine(handler: (l: TraceLine) => void): this;
    serialize(): ErrMemento;
    deserialize(memento: ErrMemento): this;
    toStdError(): Error;
    private updateMessage;
    private updateTrace;
    private updateScriptTrace;
    private genMessageString;
    private formatTrace;
    private genTraceString;
    private genScriptTraceString;
    private updateOutput;
    private static line;
}
export {};
