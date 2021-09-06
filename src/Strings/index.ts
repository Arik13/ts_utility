import {numToWord} from "./numberToWord";

let trim = (str: string, c: string) => {
    let regex = new RegExp(`(^${c})|(${c}$)`, "gi");
    return str.replace(regex, "");
}

export {
    trim,
    numToWord,
}

export let capitalizeFirst = (str: string) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`;

export let isDigit = (c: string) => c >= '0' && c <= '9';

export let isAlpha = (c: string) =>
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    c === '_' || c === '$';

export let isAlphaNumeric = (c: string) =>
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    c === '_' || c === '$';