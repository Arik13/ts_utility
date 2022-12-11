import { deepMerge } from "./Objects";

let test1 = {
    // rootField: {
    //     objectField: "testObjectString"
    // },
    // secondaryStringField: "secondaryFieldValue1",
    // sameObjectField: {
    //     test2: "test1Field",
    // },
    nullField: "something",
}
let test2 = {
    // rootField: [
    //     "testArrayString"
    // ],
    // secondaryStringField: "secondaryFieldValue2",
    // sameObjectField: {
    //     test1: "test1Field",
    // },
    nullField: null as any,
}
console.log(deepMerge(test1, test2));
console.log(deepMerge(test2, test1));
