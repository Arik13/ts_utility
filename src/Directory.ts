import * as mong from "mongoose";

export const genID = () => new mong.Types.ObjectId().toString();

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
        this.initPaths();
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
        if (this.isAncestor(move, target)) return false;

        let moveParent = this.get(move.parentID);
        let dragIndex = moveParent.children.findIndex(child => child.id == move.id);
        moveParent.children.splice(dragIndex, 1);
        target.children.splice(insertionIndex, 0, move);
        move.parentID = target.id;
        return true;
    }
    isAncestor(superNode: Directory, subNode: Directory): boolean {
        if (superNode.id == subNode.id) return true;
        if (!subNode.parentID) return false;
        return this.isAncestor(superNode, this.get(subNode.parentID));
    }
    traverse(visit: (dir: Directory, dirMap?: DirectoryMap) => void, rootID?: string) {
        (function inner(dir: Directory, dirMap: DirectoryMap) {
            visit(dir, dirMap);
            dir.children.forEach(subDir => inner(subDir, dirMap));
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
    private initPaths() {
        let pathStack: string[] = [];
        (function inner(dir: Directory, dirMap: DirectoryMap) {
            pathStack.push(dir.name);
            dirMap.idMap.set(dir.id, dir);
            let path = `${pathStack.join("/")}${dir.ext ?? ""}`;
            dir.path = path;
            dirMap.pathMap.set(path, dir);
            dir.children.forEach(subDir => inner(subDir, dirMap));
            pathStack.pop();
        })(this.root, this);
    }
    add(dir: Directory) {
        return this.has(dir.id)? null : this.set(dir);
    }
    private setRoot(dir?: Directory) {
        this.root = {
            id: genID(),
            name: "",
            children: dir?.children ?? [],
            parentID: null,
            itemID: null,
        };
        this.idMap.set(this.root.id, this.root);
        return this.root;
    }
    set(dir: Directory) {
        let parent = this.get(dir.parentID);
        parent.children.push(dir);
        this.idMap.set(dir.id, dir);
        dir.path = `${parent.path}/${dir.name}`;
        this.pathMap.set(dir.path, dir);
        return dir;
    }
    get(idOrPath: string) {
        return this.idMap.get(idOrPath) ?? this.pathMap.get(idOrPath);
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
    createAssetDir(asset: {id?: string, name?: string, dirID?: string}, ext: string, parentID: string) {
        asset.dirID = genID();
        return this.set({
            id: asset.dirID,
            name: asset.name,
            children: [],
            parentID,
            itemID: asset.id,
            ext,
        });
    }
    createDir(name: string, parentID: string) {
        return this.set({
            id: genID(),
            name,
            children: [],
            parentID,
            itemID: null,
        });
    }
    rename(id: string, name: string) {
        this.get(id).name = name;
    }
}
