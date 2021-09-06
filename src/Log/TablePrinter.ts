import { StringMonad, NumberMonad } from "@shared/Util/Monads/Monads";
import { Primitive } from "../Types";

interface ColumnStyle {
    s?: string;
    d?: number;
    l?: number;
}
interface ColumnOptions {
    [key: number]: ColumnStyle;
}
interface TableOptions {
    colGap?: number;
    usePad?: boolean;
}

export let printCSV = (
    table: number[][],
) => {
    let styledTable = table.map(x => x.join(", "));
    console.log(styledTable.join("\r\n"));
}

export let printTable = (
    headers: string[],
    table: Primitive[][],
    tableOptions: TableOptions,
    colOptions: ColumnOptions = {},
) => {
    let styles: ColumnOptions = headers.map((h, i) => ({
        ...colOptions[i],
        l: h.length + tableOptions.colGap,
    }));
    let usePadding = tableOptions.usePad ?? true;

    let styledHeaders = headers.map((h, i) => usePadding? h.padStart(styles[i].l) : h);
    let styleCell = (val: Primitive, i: number) => {
        let s = styles[i];
        let padfunc = (val: string) => usePadding? val.padStart(s.l) : val;
        if (typeof val == "number") {
            return new NumberMonad(val)
                .map(val => s.s == "%"? val * 100 : val)
                .toStrMonad(val => s.d? val.toFixed(s.d) : String(val))
                .map(padfunc)
                .return();
        }
        else if (typeof val == "string") {
            return new StringMonad(val)
                .map(padfunc)
                .return();
        }
        else if (typeof val == "boolean") {
            return String(val);
        }
    }
    let styledTable = table
        .map(row => row
            .map(styleCell)
            .join("")
            .substring(usePadding? tableOptions.colGap : 0)
        );
    let headerString = styledHeaders
        .join("")
        .substring(usePadding? tableOptions.colGap : 0);
    let vBorder = "";
    for (let i = 0; i < headerString.length; i++) {
        vBorder += "-";
    }
    console.log(vBorder);
    console.log(headerString);
    styledTable.forEach(row => console.log(row));
    console.log(vBorder);
}