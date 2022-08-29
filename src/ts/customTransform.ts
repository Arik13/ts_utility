import * as ts from "typescript";
export default function (/*opts?: Opts*/) {
    function visitor(ctx: ts.TransformationContext, sf: ts.SourceFile) {
        const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<any> => {
            if (
                node.parent?.kind == ts.SyntaxKind.ImportDeclaration
                && node.kind == ts.SyntaxKind.StringLiteral
            ) {
                let text = node.getText();
                let path = text.substring(1, text.length - 1);
                let pathArray = path.split("/");
                let dict: any = {
                    "@root": "",
                    "@shared": "vtt_shared/dist/src",
                    "@node": "node_utility/dist/src",
                    "@util": "ts_utility/dist/src",
                }
                if (dict[pathArray[0]] !== undefined) {
                    pathArray[0] = dict[pathArray[0]];
                    let newPath = pathArray.filter(x => x).join("/")
                    return ts.createStringLiteral(newPath);
                }
            }
            return ts.visitEachChild(node, visitor, ctx)
        }
        return visitor;
    }
    return (ctx: ts.TransformationContext): ts.Transformer<any> => {
        return (sf: ts.SourceFile) => ts.visitNode(sf, visitor(ctx, sf))
    }
}