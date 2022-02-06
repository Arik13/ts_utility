export declare const genID: () => string;
export interface Permission {
    level: number;
    exceptions: string[];
}
export interface Permissions {
    visible: Permission;
}
export declare enum ASSET_NAME {
    FALSEY = 0,
    DIRECTORY = 1,
    IMAGE = 2,
    COMPONENT_DEFINITION = 3,
    SCRIPT = 4,
    LOCATION = 5,
    TOKEN = 6,
    STATE_OBJECT = 7,
    STATE_OBJECT_TEMPLATE = 8
}
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
    permissions: Permissions;
    type: ASSET_NAME;
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
    sort(id?: string): void;
    get(idOrPath: string): Directory;
    has(idOrPath: string): boolean;
    map<T>(cb: (dir: Directory) => T, idOrPath?: string): T[];
    delete(id: string): void;
    createAssetDir(asset: {
        id?: string;
        name?: string;
        dirID?: string;
    }, ext: string, parentID: string, type: ASSET_NAME): Directory;
    createDir(name: string, parentID: string): Directory;
    rename(id: string, name: string): void;
    setPermissionLevel(dirID: string, permission: keyof Permissions, level: number): void;
    setPermissionLevelOnTree(dirID: string, permission: keyof Permissions, level: number): void;
    addPermissionException(dirID: string, permission: keyof Permissions, exceptionID: string): void;
    addPermissionExceptionOnTree(dirID: string, permission: keyof Permissions, exceptionID: string): void;
    removePermissionException(dirID: string, permission: keyof Permissions, exceptionID: string): void;
    removePermissionExceptionOnTree(dirID: string, permission: keyof Permissions, exceptionID: string): void;
}
