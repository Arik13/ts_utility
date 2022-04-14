"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.time_a = exports.time_s = exports.calcSetDifference = exports.uniqueCompare = exports.unique = exports.generatePassword = exports.tablesEqual = exports.arraysEqual = exports.merge = exports.diffsToAccumulatingSums = exports.accumulatedSumsToDiffs = exports.convertColumnsToRows = exports.calcPercDistribution = exports.generateOrdinalNumerals = exports.toOrdinalNumeral = exports.reduceMax = exports.groupByIndexSorter = exports.wordFinder = exports.containerWordFinder = exports.isNumeric = exports.pipe = exports.compose = exports.deeplogN = exports.deeplog = void 0;
const util = require("util");
function deeplog(...args) {
    console.info(util.formatWithOptions({ colors: true, depth: 100 }, "%O", ...args));
}
exports.deeplog = deeplog;
function deeplogN(n, ...args) {
    console.info(util.formatWithOptions({ colors: true, depth: n }, "%O", ...args));
}
exports.deeplogN = deeplogN;
const compose = (...args) => // The compose return type, aka the composed function signature
 {
    return (input) => args.reduceRight((val, fn) => fn(val), input);
};
exports.compose = compose;
const pipe = (...args) => // The pipe return type, aka the composed function signature
 {
    return (input) => args.reduce((val, fn) => fn(val), input);
};
exports.pipe = pipe;
function isNumeric(str) {
    return /^\d+$/.test(str);
}
exports.isNumeric = isNumeric;
let containerWordFinder = (words, path) => (x) => {
    let array = x;
    path === null || path === void 0 ? void 0 : path.forEach(p => array = x[p]);
    let specificWordFinder = (0, exports.wordFinder)(words);
    return array.reduce((p, c) => p || specificWordFinder(c), false);
};
exports.containerWordFinder = containerWordFinder;
let wordFinder = (exps) => (target) => {
    return exps.map(w => !!target.match(w)).reduce((p, c) => p || c, false);
};
exports.wordFinder = wordFinder;
let groupByIndexSorter = (indices) => {
    let revIndicies = indices.map(x => x).reverse();
    let internal1 = (a, b) => {
        let indices = revIndicies.map(x => x);
        let internal2 = (a, b) => {
            if (!indices.length)
                return 0;
            let i = indices.pop();
            if (a[i] > b[i])
                return -1;
            if (a[i] < b[i])
                return 1;
            return internal2(a, b);
        };
        return internal2(a, b);
    };
    return internal1;
};
exports.groupByIndexSorter = groupByIndexSorter;
let reduceMax = (p, c) => p > c ? p : c;
exports.reduceMax = reduceMax;
// let suffix = (num: number) => {
//     let lastTwoDigits = num % 100;
//     if (lastTwoDigits >= 10 && lastTwoDigits < 20) return "th";
//     let lastDigit = num % 10;
//     return lastDigit > 2? "th" : ["st", "nd", "rd"][lastDigit];
// }
let suffix = (n) => n % 100 >= 10 && n % 100 < 20 || n % 10 > 2 ? "th" : ["st", "nd", "rd"][n % 10];
let toOrdinalNumeral = (n) => `${n}${suffix(n - 1)}`;
exports.toOrdinalNumeral = toOrdinalNumeral;
let generateOrdinalNumerals = (top) => !top ? [] : Array(top).fill(0).map((x, i) => `${i + 1}${suffix(i)}`);
exports.generateOrdinalNumerals = generateOrdinalNumerals;
let calcPercDistribution = (buckets) => {
    const TOTAL_PERCENTAGE = 100;
    let averagePercentage = Math.floor(TOTAL_PERCENTAGE / buckets);
    let percentageRemainder = TOTAL_PERCENTAGE % buckets;
    let percentages = Array(buckets).fill(averagePercentage);
    // let percentages = [];
    // for (let i = 0; i < buckets; i++) {
    //     percentages.push(averagePercentage);
    // }
    percentages[0] += percentageRemainder;
    return percentages;
};
exports.calcPercDistribution = calcPercDistribution;
// export let colsToRows = (x: number[], i: number, a: number[][]) => Array(a.length).fill(0).map((v, j, b) => a[j][i]);
let convertColumnsToRows = (table) => {
    let newTable = table[0].map(x => []);
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            newTable[j].push(table[i][j]);
        }
    }
    return newTable;
};
exports.convertColumnsToRows = convertColumnsToRows;
let accumulatedSumsToDiffs = (x, i, a) => i ? x - a[i - 1] : x;
exports.accumulatedSumsToDiffs = accumulatedSumsToDiffs;
// @ts-ignore
exports.diffsToAccumulatingSums = ((x, i) => i ? (this.s = x + this.s) : this.s = x).bind({ s: 0 });
let merge = (arr2) => (x, i) => [x, arr2[i]];
exports.merge = merge;
let arraysEqual = (a, b, pred) => {
    if (a.length != b.length)
        return false;
    let p = pred !== null && pred !== void 0 ? pred : ((a, b) => a === b);
    for (let i = 0; i < a.length; i++) {
        if (!p(a[i], b[i]))
            return false;
    }
    return true;
    // return a.findIndex((x, i) => p(x, b[i])) != -1;
};
exports.arraysEqual = arraysEqual;
let tablesEqual = (a, b, pred) => {
    return !a.map((x, i) => (0, exports.arraysEqual)(x, b[i], pred)).some(x => !x);
};
exports.tablesEqual = tablesEqual;
let getCharacterSet = () => {
    return [
        Array(10).fill(0).map((x, i) => String(i)),
        Array(26).fill("A".charCodeAt(0)).map((x, i) => String.fromCharCode(x + i)),
        Array(26).fill("a".charCodeAt(0)).map((x, i) => String.fromCharCode(x + i)),
        // "!@#$".split(""),
        "~`!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/".split(""),
    ].flat();
};
let randomInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1));
let generatePassword = (length = 16) => {
    let charSet = getCharacterSet();
    let hi = charSet.length - 1;
    let password = Array(length).fill(0).map(x => charSet[randomInt(0, hi)]).join("");
    console.log(password);
};
exports.generatePassword = generatePassword;
let unique = (x, i, a) => i == 0 || a[i - 1] !== x;
exports.unique = unique;
let uniqueCompare = (equal) => (x, i, a) => (i == 0 || !equal(x, a[i - 1]));
exports.uniqueCompare = uniqueCompare;
let calcSetDifference = (u, v) => {
    let diffArray = [];
    u.forEach((value, key) => {
        if (!v.get(key)) {
            diffArray.push(value);
        }
    });
    return diffArray;
};
exports.calcSetDifference = calcSetDifference;
let time_s = (label, procedure) => {
    console.time(label);
    procedure();
    console.timeEnd(label);
};
exports.time_s = time_s;
let time_a = (label, procedure) => __awaiter(void 0, void 0, void 0, function* () {
    console.time(label);
    yield procedure();
    console.timeEnd(label);
});
exports.time_a = time_a;
//# sourceMappingURL=Functions.js.map