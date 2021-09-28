"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryMap = exports.genID = void 0;
const mong = require("mongoose");
const genID = () => new mong.Types.ObjectId().toString();
exports.genID = genID;
class DirectoryMap extends Map {
    constructor() {
        super();
        this.idMap = new Map();
        this.pathMap = new Map();
        this.root = {
            id: (0, exports.genID)(),
            name: "root",
            children: [],
            parentID: null,
            itemID: null,
        };
        super.set(this.root.id, this.root);
    }
    init(root) {
        this.clear();
        this.root = root;
        this.traverse(dir => super.set(dir.id, dir));
        return this;
    }
    move(moveID, targetID) {
        if (moveID == targetID)
            return false;
        let move = this.get(moveID);
        let target = this.get(targetID);
        let insertionIndex = 0;
        if (target.itemID) {
            let targetParent = this.get(target.parentID);
            insertionIndex = targetParent.children.findIndex(node => node.id == target.id) + 1;
            target = targetParent;
        }
        if (this.isAncestor(move, target))
            return false;
        let moveParent = this.get(move.parentID);
        let dragIndex = moveParent.children.findIndex(child => child.id == move.id);
        moveParent.children.splice(dragIndex, 1);
        target.children.splice(insertionIndex, 0, move);
        move.parentID = target.id;
        return true;
    }
    initPaths() {
        let nameLength = this.root.name.length + 1;
        this.traversePath((dir, path) => dir.path = `.${path.substring(nameLength)}`);
        return this;
    }
    isAncestor(superNode, subNode) {
        if (superNode.id == subNode.id)
            return true;
        if (!subNode.parentID)
            return false;
        return this.isAncestor(superNode, this.get(subNode.parentID));
    }
    traverse(visit, rootID) {
        var _a;
        const inner = (dir, visit) => {
            visit(dir, this);
            dir.children.forEach(subDir => inner(subDir, visit));
        };
        inner((_a = this.get(rootID)) !== null && _a !== void 0 ? _a : this.root, visit);
    }
    traversePath(visit) {
        let pathStack = [];
        const inner = (dir, visit) => {
            pathStack.push(dir.name);
            let path = "/" + pathStack.reduce((p, c) => `${p}/${c}`);
            visit(dir, path, this);
            dir.children.forEach(subDir => inner(subDir, visit));
            pathStack.pop();
        };
        inner(this.root, visit);
    }
    add(dir) {
        if (this.has(dir.id))
            return;
        this.set(dir.id, dir);
        return dir;
    }
    set(id, dir) {
        let parent = this.get(dir.parentID);
        parent.children.push(dir);
        return super.set(id, dir);
    }
    delete(id) {
        let dir = this.get(id);
        let parent = this.get(dir.parentID);
        dir.parentID = null;
        let childIndex = parent.children.findIndex(subDir => dir.id == subDir.id);
        parent.children.splice(childIndex, 1);
        return super.delete(dir.id);
    }
    createAssetDir(asset, parentID) {
        let dir = {
            id: (0, exports.genID)(),
            name: asset.name,
            children: [],
            parentID,
            itemID: asset.id,
        };
        this.set(dir.id, dir);
        asset.dirID = dir.id;
        return dir;
    }
    createDir(name, parentID) {
        let dir = {
            id: (0, exports.genID)(),
            name,
            children: [],
            parentID,
            itemID: null,
        };
        this.set(dir.id, dir);
        return dir;
    }
    rename(id, name) {
        this.get(id).name = name;
    }
}
exports.DirectoryMap = DirectoryMap;
//# sourceMappingURL=DirectoryBackup.js.map