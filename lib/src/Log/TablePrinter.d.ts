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
export declare let printCSV: (table: number[][]) => void;
export declare let printTable: (headers: string[], table: Primitive[][], tableOptions: TableOptions, colOptions?: ColumnOptions) => void;
export {};
