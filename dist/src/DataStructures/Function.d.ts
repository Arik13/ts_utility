export {};
import "./Set";
declare let functionMethods: {
    readonly _: string;
};
declare type FunctionExtension = typeof functionMethods;
declare global {
    interface Function extends FunctionExtension {
    }
}
