export declare const genID: () => string;
export declare enum PERMISSION_LEVEL {
    GM = "GM",
    PLAYER = "PLAYER"
}
export interface Permission {
    level: PERMISSION_LEVEL;
    exceptions: string[];
}
export interface Permissions {
    visible: Permission;
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
    setPermission(dirID: string, permission: keyof Permissions, level: PERMISSION_LEVEL): void;
    setPermissionsOnTree(dirID: string, permission: keyof Permissions, level: PERMISSION_LEVEL): void;
    addPermissionException(dirID: string, permission: keyof Permissions, exceptionID: string): void;
    addPermissionExceptionOnTree(dirID: string, permission: keyof Permissions, exceptionID: PERMISSION_LEVEL): void;
    removePermissionException(dirID: string, permission: keyof Permissions, exceptionID: string): void;
    removePermissionExceptionOnTree(dirID: string, permission: keyof Permissions, exceptionID: string): void;
}
