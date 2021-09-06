import { capitalizeFirst } from "./index";

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
    digit(n: number, useCapitalize: boolean) {
        return this.getWord(this.digits, n, useCapitalize);
    },
    teen(n: number, useCapitalize: boolean) {
        return this.getWord(this.teens, n, useCapitalize);
    },
    ten(n: number, useCapitalize: boolean) {
        return this.getWord(this.tens, n, useCapitalize);
    },
    mag(n: number, useCapitalize: boolean) {
        return this.getWord(this.magnitudes, n, useCapitalize);
    },
    getWord(list: string[], n: number, useCapitalize: boolean) {
        let i = Math.floor(n);
        return useCapitalize? capitalizeFirst(list[i]) : list[i];
    }
}

let sub20ToWord = (n: number, c: boolean) => n < 10? w.digit(n, c) : w.teen(n - 10, c);
let sub100ToWord = (n: number, c: boolean) => {
    if (n < 20)
        return sub20ToWord(n, c);
    return `${w.ten(n / 10, c)}${n % 10? `-${w.digit(n % 10, c)}` : ""}`;
};
let sub1000ToWord = (n: number, c: boolean) => {
    if (n < 100)
        return sub100ToWord(n, c);
    return `${w.digit(n / 100, c)}-${w.mag(0, c)}${n % 100? `${n % 100 < 20? " and" : ""} ${sub100ToWord(n % 100, c)}` : ""}`
};
export let numToWord = (n: number, c: boolean = true) => {
    let m = 1;  // Starting Magnitude
    let chunk = n % 1000;
    let string = chunk? `${n > 999 && n % 1000 < 20? "and " : ""}${sub1000ToWord(chunk, c)}` : "";
    while (n = Math.floor(n / 1000)) {
        string = n % 1000? `${sub1000ToWord(n % 1000, c)}-${w.mag(m, c)} ${string}` : string;
        m++;
    }
    return string;
}