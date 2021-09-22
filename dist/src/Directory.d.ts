import { Map2 } from "./DataStructures/Map";
export interface Directory {
    id?: string;
    name: string;
    parentID: string;
    children: Directory[];
    itemID: string;
    isOpen?: boolean;
    path?: string;
}
export declare const genID: () => string;
export declare class DirectoryMap extends Map2<Directory> {
    root: Directory;
    constructor();
    init(root: Directory): this;
    move(moveID: string, targetID: string): boolean;
    isAncestor(superNode: Directory, subNode: Directory): boolean;
    traverse(visit: (dir: Directory, dirMap?: DirectoryMap) => void, rootID?: string): void;
    traversePath(visit: (dir: Directory, path: string, dirMap?: DirectoryMap) => void): void;
    add(dir: Directory): Directory;
    set(id: string, dir: Directory): this;
    delete(id: string): boolean;
    createAssetDir(asset: {
        id?: string;
        name?: string;
        dirID?: string;
    }, parentID: string): Directory;
    createDir(name: string, parentID: string): Directory;
    rename(id: string, name: string): void;
}
