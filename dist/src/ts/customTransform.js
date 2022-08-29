"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function default_1( /*opts?: Opts*/) {
    function visitor(ctx, sf) {
        const visitor = (node) => {
            var _a;
            if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) == ts.SyntaxKind.ImportDeclaration
                && node.kind == ts.SyntaxKind.StringLiteral) {
                let text = node.getText();
                let path = text.substring(1, text.length - 1);
                let pathArray = path.split("/");
                let dict = {
                    "@root": "src/",
                    "@shared": "vtt_shared/dist/src",
                    "@node": "node_utility/dist/src",
                    "@util": "ts_utility/dist/src",
                };
                if (dict[pathArray[0]] !== undefined) {
                    pathArray[0] = dict[pathArray[0]];
                    let newPath = pathArray.filter(x => x).join("/");
                    return ts.createStringLiteral(newPath);
                }
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    }
    return (ctx) => {
        return (sf) => ts.visitNode(sf, visitor(ctx, sf));
    };
}
exports.default = default_1;
//# sourceMappingURL=customTransform.js.map