import { genID } from "./Functions";

export interface Permission {
    level: number;
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
let defaultPermissions = (): Permissions => ({
    visible: {
        level: 0,
        exceptions: [],
    }
})
export class DirectoryMap {
    root: Directory;
    idMap = new Map<string, Directory>();
    pathMap = new Map<string, Directory>();
    constructor(root?: Directory) {
        this.reset(root);
    }
    reset(root: Directory) {
        this.idMap.clear();
        this.pathMap.clear();
        this.setRoot(root);
        this.initPaths(this.root);
        return this;
    }
    move(moveID: string, targetID: string) {
        if (moveID == targetID) return false;
        let move = this.get(moveID);
        let target = this.get(targetID);
        let insertionIndex = 0;
        if (target.itemID) {
            let targetParent = this.get(target.parentID)
            insertionIndex = targetParent.children.findIndex(node => node.id == target.id) + 1;
            target = targetParent;
        }
        // if (target.id == move.parentID) return false;
        if (this.isAncestor(move, target)) return false;

        let moveParent = this.get(move.parentID);
        let moveIndex = moveParent.children.findIndex(child => child.id == move.id);
        moveParent.children.splice(moveIndex, 1);
        target.children.splice(insertionIndex, 0, move);
        move.parentID = target.id;
        this.traverse(dir => {
            this.pathMap.delete(dir.path);
            dir.path = null;
        }, move.id);
        this.resolveNameAndPath(move);
        this.sort(moveParent.id);
        this.sort(target.id);
        return true;
    }
    traverse(visit: (dir: Directory, dirMap?: DirectoryMap) => void, rootID?: string) {
        (function recurse(dir: Directory, dirMap: DirectoryMap) {
            visit(dir, dirMap);
            dir.children.forEach(subDir => recurse(subDir, dirMap));
        })(this.get(rootID) ?? this.root, this);
    }
    visitAssets(visit: (dir: Directory, dirMap?: DirectoryMap) => void, rootID?: string) {
        let root = this.get(rootID) ?? this.root;
        this.traverse(dir => {if (dir.itemID) visit(dir, this)}, root.id);
    }
    mapAssets<T>(cb: (dir: Directory, dirMap?: DirectoryMap) => T, rootID?: string) {
        let assets: Directory[] = [];
        this.visitAssets(dir => assets.push(dir), rootID);
        return assets.map(dir => cb(dir, this));
    }
    add(dir: Directory) {
        return this.has(dir.id)? null : this.set(dir);
    }
    set(dir: Directory) {
        let parent = this.get(dir.parentID);
        parent.children.push(dir);
        this.resolveNameAndPath(dir);
        this.idMap.set(dir.id, dir);
        this.pathMap.set(dir.path, dir);
        this.sort(parent.id);
        return dir;
    }
    replace(dir: Directory) {
        let parent = this.getParent(dir.path);
        if (!parent) throw new Error(`Can not replace ${dir.path}`);
        this.delete(dir.path);
        dir.parentID = parent.id;
        this.set(dir);
    }
    rename(id: string, name: string) {
        let dir = this.get(id);
        dir.name = name;
        this.traverse(dir => {
            this.pathMap.delete(dir.path);
            dir.path = null;
        }, dir.id);
        this.resolveNameAndPath(dir);
        this.sort(this.get(dir.parentID).id);
    }
    get(idOrPath: string) {
        return this.idMap.get(idOrPath) ?? this.pathMap.get(idOrPath);
    }
    getParent(idOrPath: string) {
        let dir = this.get(idOrPath);
        if (dir.parentID === null) return;
        return this.get(dir.parentID);
    }
    has(idOrPath: string) {
        return this.idMap.has(idOrPath) || this.pathMap.has(idOrPath);
    }
    map<T>(cb: (dir: Directory) => T, idOrPath?: string): T[] {
        let root = this.get(idOrPath) ?? this.root;
        let array: T[] = [];
        this.traverse(dir => array.push(cb(dir)), root.id);
        return array;
    }
    delete(id: string) {
        let dir = this.get(id);
        if (!dir) return;
        let parent = this.get(dir.parentID);
        if (!parent) return;
        let dirKeys = this.map(d => [d.id, d.path], dir.id);
        dirKeys.forEach(([id, path]) => {
            this.idMap.delete(id);
            this.pathMap.delete(path);
        });
        dir.parentID = null;
        let childIndex = parent.children.findIndex(subDir => dir.id == subDir.id);
        parent.children.splice(childIndex, 1);
        this.idMap.delete(dir.id);
        this.pathMap.delete(dir.path);
    }
    createAssetDir(name: string, parentID: string, itemID?: string, ext?: string) {
        return this.set({
            id: genID(),
            name,
            path: null,
            parentID,
            itemID,
            ext,
            permissions: defaultPermissions(),
            children: [],
        });
    }
    createDir(name: string, parentID: string) {
        return this.set({
            id: genID(),
            name,
            path: null,
            parentID,
            itemID: null,
            permissions: defaultPermissions(),
            children: [],
        });
    }
    // PERMISSIONS
    // setVisiblityLevel(dirID: string, level: PERMISSION_LEVEL) {
    //     this.setPermission(dirID, "visible", level);
    // }
    // setTreeVisiblityLevel(dirID: string, level: PERMISSION_LEVEL) {
    //     this.setPermissionsOnTree(dirID, "visible", level);
    // }
    setPermissionLevel(dirID: string, permission: keyof Permissions, level: number) {
        this.get(dirID).permissions[permission].level = level;
    }
    setPermissionLevelOnTree(dirID: string, permission: keyof Permissions, level: number) {
        this.traverse(dir => dir.permissions[permission].level = level, dirID);
    }
    addPermissionException(dirID: string, permission: keyof Permissions, exceptionID: string) {
        this.get(dirID).permissions[permission].exceptions.push(exceptionID);
    }
    addPermissionExceptionOnTree(dirID: string, permission: keyof Permissions, exceptionID: string) {
        this.traverse(dir => dir.permissions[permission].exceptions.push(exceptionID), dirID);
    }
    removePermissionException(dirID: string, permission: keyof Permissions, exceptionID: string) {
        this.get(dirID).permissions[permission].exceptions.remove(x => x === exceptionID);
    }
    removePermissionExceptionOnTree(dirID: string, permission: keyof Permissions, exceptionID: string) {
        this.traverse(dir => dir.permissions[permission].exceptions.remove(x => x === exceptionID), dirID);
    }
    private isAncestor(superNode: Directory, subNode: Directory): boolean {
        if (!superNode || ! subNode) return false;
        if (superNode.id == subNode.id) return true;
        if (!subNode.parentID) return false;
        return this.isAncestor(superNode, this.get(subNode.parentID));
    }
    private resolveNameAndPath(dir: Directory) {
        let parent = this.get(dir.parentID);
        let path = `${parent.path}/${dir.name}${dir.ext ?? ""}`;
        let baseName = dir.name;
        let i = 1;
        while (this.pathMap.get(path)) {
            dir.name = `${baseName} (${i})`
            path = `${parent.path}/${dir.name}${dir.ext ?? ""}`;
            i++;
        }
        dir.path = path;
        this.initPaths(dir);
    }
    private sort(id: string = null) {
        let dir = id? this.get(id) : this.root;
        dir.children.sort((a, b) => {
            if (a.itemID && !b.itemID) return 1;
            else if (b.itemID && !a.itemID) return -1;
            else if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            return 0;
        });
    }
    private initPaths(dir: Directory) {
        let pathStack: string[] = [];
        if (dir.parentID) {
            pathStack.push(this.get(dir.parentID).path);
        }
        (function recurse(dir: Directory, dirMap: DirectoryMap) {
            pathStack.push(dir.name);
            dirMap.idMap.set(dir.id, dir);
            // dirMap.pathMap.delete(dir.path);
            let path = `${pathStack.join("/")}${dir.ext ?? ""}`;
            dir.path = path;
            dirMap.pathMap.set(path, dir);
            dir.children.forEach(subDir => recurse(subDir, dirMap));
            pathStack.pop();
        })(dir, this);
    }
    private setRoot(dir?: Directory) {
        this.root = {
            id: dir?.id ?? genID(),
            name: "",
            path: "",
            parentID: null,
            itemID: null,
            permissions: defaultPermissions(),
            children: dir?.children ?? [],
            // type: ASSET_NAME.DIRECTORY,
        };
        this.idMap.set(this.root.id, this.root);
        return this.root;
    }
}
