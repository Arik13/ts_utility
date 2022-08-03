import * as ts from "typescript";
export default function (): (ctx: ts.TransformationContext) => ts.Transformer<any>;
