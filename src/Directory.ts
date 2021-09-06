import * as mong from "mongoose";
import { Map2 } from "./DataStructures/Map";

export interface Directory {
    id?: string,
    name: string;
    parentID: string;
    children: Directory[];
    itemID: string;
    isOpen?: boolean;
    path?: string;
}

export const genID = () => new mong.Types.ObjectId().toString();

export class DirectoryMap extends Map2<Directory> {
    root: Directory;
    constructor() {
        super();
        this.root = {
            id: genID(),
            name: "root",
            children: [],
            parentID: null,
            itemID: null,
        };
        super.set(this.root.id, this.root);
    }
    init(root: Directory) {
        this.clear();
        this.root = root;

        this.traverse(dir => {
            super.set(dir.id, dir);
        });
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
        const inner = (dir: Directory, visit: (dir: Directory, dirMap?: DirectoryMap) => void) => {
            visit(dir, this);
            dir.children.forEach(subDir => {
                inner(subDir, visit);
            });
        }
        inner(this.get(rootID) ?? this.root, visit);
    }
    traversePath(visit: (dir: Directory, path: string, dirMap?: DirectoryMap) => void) {
        let pathStack: string[] = [];
        const inner = (dir: Directory, visit: (dir: Directory, path?: string, dirMap?: DirectoryMap) => void) => {
            pathStack.push(dir.name);
            let path = "/" + pathStack.reduce((p, c) => `${p}/${c}`);
            visit(dir, path, this);
            dir.children.forEach(subDir => {
                inner(subDir, visit);
            });
            pathStack.pop();
        }
        inner(this.root, visit);
    }
    add(dir: Directory) {
        if (this.has(dir.id)) return;
        this.set(dir.id, dir);
        return dir;
    }
    set(id: string, dir: Directory) {
        let parent = this.get(dir.parentID);
        parent.children.push(dir);
        return super.set(id, dir);
    }
    delete(id: string) {
        let dir = this.get(id);
        let parent = this.get(dir.parentID);
        dir.parentID = null;
        let childIndex = parent.children.findIndex(subDir => dir.id == subDir.id);
        parent.children.splice(childIndex, 1);
        return super.delete(dir.id);
    }
    createAssetDir(asset: {id?: string, name?: string, dirID?: string}, parentID: string) {
        let dir: Directory = {
            id: genID(),
            name: asset.name,
            children: [],
            parentID,
            itemID: asset.id,
        }
        this.set(dir.id, dir);
        asset.dirID = dir.id;
        return dir;
    }
    createDir(name: string, parentID: string) {
        let dir: Directory = {
            id: genID(),
            name,
            children: [],
            parentID,
            itemID: null,
        }
        this.set(dir.id, dir);
        return dir;
    }
    rename(id: string, name: string) {
        this.get(id).name = name;
    }
}