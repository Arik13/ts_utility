"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryMap = exports.genID = void 0;
const mong = require("mongoose");
const genID = () => new mong.Types.ObjectId().toString();
exports.genID = genID;
let defaultPermissions = () => ({
    visible: {
        level: 0,
        exceptions: [],
    }
});
class DirectoryMap {
    constructor(root) {
        this.idMap = new Map();
        this.pathMap = new Map();
        this.reset(root);
    }
    reset(root) {
        this.idMap.clear();
        this.pathMap.clear();
        this.setRoot(root);
        this.initPaths(this.root);
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
    isAncestor(superNode, subNode) {
        if (!superNode || !subNode)
            return false;
        if (superNode.id == subNode.id)
            return true;
        if (!subNode.parentID)
            return false;
        return this.isAncestor(superNode, this.get(subNode.parentID));
    }
    traverse(visit, rootID) {
        var _a;
        (function recurse(dir, dirMap) {
            visit(dir, dirMap);
            dir.children.forEach(subDir => recurse(subDir, dirMap));
        })((_a = this.get(rootID)) !== null && _a !== void 0 ? _a : this.root, this);
    }
    visitAssets(visit, rootID) {
        var _a;
        let root = (_a = this.get(rootID)) !== null && _a !== void 0 ? _a : this.root;
        this.traverse(dir => { if (dir.itemID)
            visit(dir, this); }, root.id);
    }
    mapAssets(cb, rootID) {
        let assets = [];
        this.visitAssets(dir => assets.push(dir), rootID);
        return assets.map(dir => cb(dir, this));
    }
    initPaths(dir) {
        let pathStack = [];
        if (dir.parentID) {
            pathStack.push(this.get(dir.parentID).path);
        }
        (function recurse(dir, dirMap) {
            var _a;
            pathStack.push(dir.name);
            dirMap.idMap.set(dir.id, dir);
            let path = `${pathStack.join("/")}${(_a = dir.ext) !== null && _a !== void 0 ? _a : ""}`;
            dir.path = path;
            dirMap.pathMap.set(path, dir);
            dir.children.forEach(subDir => recurse(subDir, dirMap));
            pathStack.pop();
        })(dir, this);
    }
    add(dir) {
        return this.has(dir.id) ? null : this.set(dir);
    }
    setRoot(dir) {
        var _a;
        this.root = {
            id: (0, exports.genID)(),
            name: "",
            children: (_a = dir === null || dir === void 0 ? void 0 : dir.children) !== null && _a !== void 0 ? _a : [],
            parentID: null,
            itemID: null,
            permissions: defaultPermissions(),
        };
        this.idMap.set(this.root.id, this.root);
        return this.root;
    }
    set(dir) {
        var _a;
        let parent = this.get(dir.parentID);
        parent.children.push(dir);
        parent.children.sort((a, b) => {
            if (a.itemID && !b.itemID)
                return 1;
            else if (b.itemID && !a.itemID)
                return -1;
            else if (a.name < b.name)
                return -1;
            else if (a.name > b.name)
                return 1;
            return 0;
        });
        this.idMap.set(dir.id, dir);
        dir.path = `${parent.path}/${dir.name}${(_a = dir.ext) !== null && _a !== void 0 ? _a : ""}`;
        this.pathMap.set(dir.path, dir);
        return dir;
    }
    get(idOrPath) {
        var _a;
        return (_a = this.idMap.get(idOrPath)) !== null && _a !== void 0 ? _a : this.pathMap.get(idOrPath);
    }
    has(idOrPath) {
        return this.idMap.has(idOrPath) || this.pathMap.has(idOrPath);
    }
    map(cb, idOrPath) {
        var _a;
        let root = (_a = this.get(idOrPath)) !== null && _a !== void 0 ? _a : this.root;
        let array = [];
        this.traverse(dir => array.push(cb(dir)), root.id);
        return array;
    }
    delete(id) {
        let dir = this.get(id);
        if (!dir)
            return;
        let parent = this.get(dir.parentID);
        if (!parent)
            return;
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
    createAssetDir(asset, ext, parentID) {
        asset.dirID = (0, exports.genID)();
        return this.set({
            id: asset.dirID,
            name: asset.name,
            children: [],
            parentID,
            itemID: asset.id,
            ext,
            permissions: defaultPermissions(),
        });
    }
    createDir(name, parentID) {
        return this.set({
            id: (0, exports.genID)(),
            name,
            children: [],
            parentID,
            itemID: null,
            permissions: defaultPermissions(),
        });
    }
    rename(id, name) {
        let dir = this.get(id);
        dir.name = name;
        this.initPaths(dir);
    }
    // // PERMISSIONS
    // setVisiblityLevel(dirID: string, level: PERMISSION_LEVEL) {
    //     this.setPermission(dirID, "visible", level);
    // }
    // setTreeVisiblityLevel(dirID: string, level: PERMISSION_LEVEL) {
    //     this.setPermissionsOnTree(dirID, "visible", level);
    // }
    setPermissionLevel(dirID, permission, level) {
        this.get(dirID).permissions[permission].level = level;
    }
    setPermissionLevelOnTree(dirID, permission, level) {
        this.traverse(dir => dir.permissions[permission].level = level, dirID);
    }
    addPermissionException(dirID, permission, exceptionID) {
        this.get(dirID).permissions[permission].exceptions.push(exceptionID);
    }
    addPermissionExceptionOnTree(dirID, permission, exceptionID) {
        this.traverse(dir => dir.permissions[permission].exceptions.push(exceptionID), dirID);
    }
    removePermissionException(dirID, permission, exceptionID) {
        this.get(dirID).permissions[permission].exceptions.remove(x => x === exceptionID);
    }
    removePermissionExceptionOnTree(dirID, permission, exceptionID) {
        this.traverse(dir => dir.permissions[permission].exceptions.remove(x => x === exceptionID), dirID);
    }
}
exports.DirectoryMap = DirectoryMap;
//# sourceMappingURL=Directory.js.map