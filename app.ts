import "module-alias/register";
import { JSONMonad } from "@util/Monads/JSONMonad";

new JSONMonad({
    test: "x",
    test2: "y",
    test3: "z",
}).traversePaths(x => {
    console.log(x.val);
    if (x.val == "x") return "end";

})
