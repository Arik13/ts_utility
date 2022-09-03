"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printTable = exports.printCSV = void 0;
const Monads_1 = require("../Monads/Monads");
let printCSV = (table) => {
    let styledTable = table.map(x => x.join(", "));
    console.log(styledTable.join("\r\n"));
};
exports.printCSV = printCSV;
let printTable = (headers, table, tableOptions, colOptions = {}) => {
    var _a;
    let styles = headers.map((h, i) => (Object.assign(Object.assign({}, colOptions[i]), { l: h.length + tableOptions.colGap })));
    let usePadding = (_a = tableOptions.usePad) !== null && _a !== void 0 ? _a : true;
    let styledHeaders = headers.map((h, i) => usePadding ? h.padStart(styles[i].l) : h);
    let styleCell = (val, i) => {
        let s = styles[i];
        let padfunc = (val) => usePadding ? val.padStart(s.l) : val;
        if (typeof val == "number") {
            return new Monads_1.NumberMonad(val)
                .map(val => s.s == "%" ? val * 100 : val)
                .toStrMonad(val => s.d ? val.toFixed(s.d) : String(val))
                .map(padfunc)
                .return();
        }
        else if (typeof val == "string") {
            return new Monads_1.StringMonad(val)
                .map(padfunc)
                .return();
        }
        else if (typeof val == "boolean") {
            return String(val);
        }
    };
    let styledTable = table
        .map(row => row
        .map(styleCell)
        .join("")
        .substring(usePadding ? tableOptions.colGap : 0));
    let headerString = styledHeaders
        .join("")
        .substring(usePadding ? tableOptions.colGap : 0);
    let vBorder = "";
    for (let i = 0; i < headerString.length; i++) {
        vBorder += "-";
    }
    console.log(vBorder);
    console.log(headerString);
    styledTable.forEach(row => console.log(row));
    console.log(vBorder);
};
exports.printTable = printTable;
//# sourceMappingURL=TablePrinter.js.map