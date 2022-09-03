"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlphaNumeric = exports.isAlpha = exports.isDigit = exports.capitalizeFirst = exports.numToWord = exports.trim = void 0;
const numberToWord_1 = require("./numberToWord");
Object.defineProperty(exports, "numToWord", { enumerable: true, get: function () { return numberToWord_1.numToWord; } });
let trim = (str, c) => {
    let regex = new RegExp(`(^${c})|(${c}$)`, "gi");
    return str.replace(regex, "");
};
exports.trim = trim;
let capitalizeFirst = (str) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
exports.capitalizeFirst = capitalizeFirst;
let isDigit = (c) => c >= '0' && c <= '9';
exports.isDigit = isDigit;
let isAlpha = (c) => (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    c === '_' || c === '$';
exports.isAlpha = isAlpha;
let isAlphaNumeric = (c) => (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9') ||
    c === '_' || c === '$';
exports.isAlphaNumeric = isAlphaNumeric;
//# sourceMappingURL=index.js.map