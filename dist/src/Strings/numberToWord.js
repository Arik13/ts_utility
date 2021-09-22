"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numToWord = void 0;
const index_1 = require("./index");
const w = {
    digits: [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
    ],
    teens: [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ],
    tens: [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ],
    magnitudes: [
        "hundred",
        "thousand",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
        "sextillion",
        "septtillion",
    ],
    digit(n, useCapitalize) {
        return this.getWord(this.digits, n, useCapitalize);
    },
    teen(n, useCapitalize) {
        return this.getWord(this.teens, n, useCapitalize);
    },
    ten(n, useCapitalize) {
        return this.getWord(this.tens, n, useCapitalize);
    },
    mag(n, useCapitalize) {
        return this.getWord(this.magnitudes, n, useCapitalize);
    },
    getWord(list, n, useCapitalize) {
        let i = Math.floor(n);
        return useCapitalize ? (0, index_1.capitalizeFirst)(list[i]) : list[i];
    }
};
let sub20ToWord = (n, c) => n < 10 ? w.digit(n, c) : w.teen(n - 10, c);
let sub100ToWord = (n, c) => {
    if (n < 20)
        return sub20ToWord(n, c);
    return `${w.ten(n / 10, c)}${n % 10 ? `-${w.digit(n % 10, c)}` : ""}`;
};
let sub1000ToWord = (n, c) => {
    if (n < 100)
        return sub100ToWord(n, c);
    return `${w.digit(n / 100, c)}-${w.mag(0, c)}${n % 100 ? `${n % 100 < 20 ? " and" : ""} ${sub100ToWord(n % 100, c)}` : ""}`;
};
let numToWord = (n, c = true) => {
    let m = 1; // Starting Magnitude
    let chunk = n % 1000;
    let string = chunk ? `${n > 999 && n % 1000 < 20 ? "and " : ""}${sub1000ToWord(chunk, c)}` : "";
    while (n = Math.floor(n / 1000)) {
        string = n % 1000 ? `${sub1000ToWord(n % 1000, c)}-${w.mag(m, c)} ${string}` : string;
        m++;
    }
    return string;
};
exports.numToWord = numToWord;
//# sourceMappingURL=numberToWord.js.map