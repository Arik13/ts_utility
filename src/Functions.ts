import * as util from "util";
import * as uuid from "short-uuid";

export const genID = () => uuid.generate();

export function deeplog(...args: any[]) {
    console.info(util.formatWithOptions({ colors: true, depth: 100 }, "%O", ...args));
}
export function deeplogN(n: number, ...args: any[]) {
    console.info(util.formatWithOptions({ colors: true, depth: n }, "%O", ...args));
}

export const compose = <T, V> (...args: readonly [
        (x: T) => any,          // 1. The input function type
        ...any[],               // 2. The middle function types
        (x: any) => V           // 3. The output function type
    ]): (x: V) => T =>          // The compose return type, aka the composed function signature
{
    return (input: V) => args.reduceRight((val, fn) => fn(val), input);
};


export const pipe = <T, V> (...args: readonly [
        (x: T) => any,          // 1. The input function type
        ...any[],               // 2. The middle function types
        (x: any) => V           // 3. The output function type
    ]): (x: T) => V =>          // The pipe return type, aka the composed function signature
{
    return (input: T) => args.reduce((val, fn) => fn(val), input);
};

export function isNumeric(str: string) {
    return /^\d+$/.test(str);
}
export let containerWordFinder = (words: (string | RegExp)[], path?: string[]) => (x: string[] | any) => {
    let array = x;
    path?.forEach(p => array = x[p]);
    let specificWordFinder = wordFinder(words);
    return (array as string[]).reduce((p, c) => p || specificWordFinder(c), false);
}
export let wordFinder = (exps: (string | RegExp)[]) => (target: string) => {
    return exps.map(w => !!target.match(w)).reduce((p, c) => p || c, false);
}

export let groupByIndexSorter = (indices: number[]) => {
    let revIndicies = indices.map(x => x).reverse();
    let internal1 = (a: any[], b: any[]) => {
        let indices = revIndicies.map(x => x);
        let internal2 = (a: any[], b: any[]): number => {
            if (!indices.length) return 0;
            let i = indices.pop();
            if (a[i] > b[i]) return -1;
            if (a[i] < b[i]) return 1;
            return internal2(a, b);
        }
        return internal2(a, b);
    }
    return internal1;
}

export let reduceMax = (p: number, c: number) => p > c? p : c;

// let suffix = (num: number) => {
//     let lastTwoDigits = num % 100;
//     if (lastTwoDigits >= 10 && lastTwoDigits < 20) return "th";
//     let lastDigit = num % 10;
//     return lastDigit > 2? "th" : ["st", "nd", "rd"][lastDigit];
// }

let suffix = (n: number) => n % 100 >= 10 && n % 100 < 20 || n % 10 > 2? "th" : ["st", "nd", "rd"][n % 10];
export let toOrdinalNumeral = (n: number) => `${n}${suffix(n - 1)}`;
export let generateOrdinalNumerals = (top: number) => !top? [] : Array(top).fill(0).map((x, i) => `${i + 1}${suffix(i)}`);

export let calcPercDistribution = (buckets: number) => {
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
}

// export let colsToRows = (x: number[], i: number, a: number[][]) => Array(a.length).fill(0).map((v, j, b) => a[j][i]);

export let convertColumnsToRows = (table: any[][]) => {
    let newTable: any[][] = table[0].map(x => []);
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            newTable[j].push(table[i][j])
        }
    }
    return newTable;
}

export let accumulatedSumsToDiffs = (x: number, i: number, a: number[]) => i? x - a[i -1] : x;
// @ts-ignore
export let diffsToAccumulatingSums = ((x: number, i: number): number => i? (this.s = x + this.s) : this.s = x).bind({s: 0});
export let merge = (arr2: any[]) => (x: any, i: number) => [x, arr2[i]];
export let arraysEqual = (a: any[], b: any[], pred?: (a: any, b: any) => boolean) => {
    if (a.length != b.length) return false;
    let p = pred ?? ((a, b) => a === b);
    for (let i = 0; i < a.length; i++) {
        if (!p(a[i], b[i])) return false;
    }
    return true;
    // return a.findIndex((x, i) => p(x, b[i])) != -1;
};
export let tablesEqual = (a: any[][], b: any[][], pred?: (a: any, b: any) => boolean) => {
    return !a.map((x, i) => arraysEqual(x, b[i], pred)).some(x => !x);
}

let getCharacterSet = () => {
    return [
        Array(10).fill(0).map((x, i) => String(i)),
        Array(26).fill("A".charCodeAt(0)).map((x, i) => String.fromCharCode(x + i)),
        Array(26).fill("a".charCodeAt(0)).map((x, i) => String.fromCharCode(x + i)),
        // "!@#$".split(""),
        "~`!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/".split(""),
    ].flat();
}

let randomInt = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1));

export let generatePassword = (length: number = 16) => {
    let charSet = getCharacterSet();
    let hi = charSet.length - 1;
    let password = Array(length).fill(0).map(x => charSet[randomInt(0, hi)]).join("");
    console.log(password);
}

export let unique = <T>(x: T, i: number, a: T[]) => i == 0 || a[i-1] !== x;
export let uniqueCompare = <T>(equal: (x: T, y: T) => boolean) => (x: T, i: number, a: T[]) => (i == 0 || !equal(x, a[i-1]));

export let calcSetDifference = (u: Map<any, any>, v: Map<any, any>) => {
    let diffArray: any[] = [];
    u.forEach((value, key) => {
        if (!v.get(key)) {
            diffArray.push(value);
        }
    });
    return diffArray;
}
export let time_s = <T>(label: string, procedure: () => T) => {
    console.time(label);
    let result = procedure();
    console.timeEnd(label);
    return result;
}
export let time_a = async <T>(label: string, procedure: () => Promise<T>) => {
    console.time(label);
    let result = await procedure();
    console.timeEnd(label);
    return result;
}
