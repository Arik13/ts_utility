"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const JSONMonad_1 = require("@util/Monads/JSONMonad");
new JSONMonad_1.JSONMonad({
    test: "x",
    test2: "y",
    test3: "z",
}).traversePaths(x => {
    console.log(x.val);
    if (x.val == "x")
        return "end";
});
//# sourceMappingURL=app.js.map