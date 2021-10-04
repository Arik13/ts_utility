export declare const genID: () => string;
export interface Directory {
    id?: string;
    name: string;
    parentID: string;
    children: Directory[];
    itemID: string;
    isOpen?: boolean;
    path?: string;
    base?: string;
    ext?: string;
}
export declare class DirectoryMap {
    root: Directory;
    idMap: Map<string, Directory>;
    pathMap: Map<string, Directory>;
    constructor(root?: Directory);
    reset(root: Directory): this;
    move(moveID: string, targetID: string): boolean;
    isAncestor(superNode: Directory, subNode: Directory): boolean;
    traverse(visit: (dir: Directory, dirMap?: DirectoryMap) => void, rootID?: string): void;
    visitAssets(visit: (dir: Directory, dirMap?: DirectoryMap) => void, rootID?: string): void;
    mapAssets<T>(cb: (dir: Directory, dirMap?: DirectoryMap) => T, rootID?: string): T[];
    private initPaths;
    add(dir: Directory): Directory;
    private setRoot;
    set(dir: Directory): Directory;
    get(idOrPath: string): Directory;
    has(idOrPath: string): boolean;
    map<T>(cb: (dir: Directory) => T, idOrPath?: string): T[];
    delete(id: string): void;
    createAssetDir(asset: {
        id?: string;
        name?: string;
        dirID?: string;
    }, ext: string, parentID: string): Directory;
    createDir(name: string, parentID: string): Directory;
    rename(id: string, name: string): void;
}
