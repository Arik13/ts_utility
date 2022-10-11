"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryMap = void 0;
const Functions_1 = require("./Functions");
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
        // if (target.id == move.parentID) return false;
        if (this.isAncestor(move, target))
            return false;
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
    add(dir) {
        return this.has(dir.id) ? null : this.set(dir);
    }
    set(dir) {
        let parent = this.get(dir.parentID);
        parent.children.push(dir);
        this.resolveNameAndPath(dir);
        this.idMap.set(dir.id, dir);
        this.pathMap.set(dir.path, dir);
        this.sort(parent.id);
        return dir;
    }
    // update(dir: Directory) {
    //
    // }
    rename(id, name) {
        let dir = this.get(id);
        dir.name = name;
        this.traverse(dir => {
            this.pathMap.delete(dir.path);
            dir.path = null;
        }, dir.id);
        this.resolveNameAndPath(dir);
        this.sort(this.get(dir.parentID).id);
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
    createAssetDir(name, parentID, itemID, ext) {
        return this.set({
            id: (0, Functions_1.genID)(),
            name,
            path: null,
            parentID,
            itemID,
            ext,
            permissions: defaultPermissions(),
            children: [],
        });
    }
    createDir(name, parentID) {
        return this.set({
            id: (0, Functions_1.genID)(),
            name,
            path: null,
            parentID,
            itemID: null,
            permissions: defaultPermissions(),
            children: [],
        });
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
    isAncestor(superNode, subNode) {
        if (!superNode || !subNode)
            return false;
        if (superNode.id == subNode.id)
            return true;
        if (!subNode.parentID)
            return false;
        return this.isAncestor(superNode, this.get(subNode.parentID));
    }
    resolveNameAndPath(dir) {
        var _a, _b;
        let parent = this.get(dir.parentID);
        let path = `${parent.path}/${dir.name}${(_a = dir.ext) !== null && _a !== void 0 ? _a : ""}`;
        let baseName = dir.name;
        let i = 1;
        while (this.pathMap.get(path)) {
            dir.name = `${baseName} (${i})`;
            path = `${parent.path}/${dir.name}${(_b = dir.ext) !== null && _b !== void 0 ? _b : ""}`;
            i++;
        }
        dir.path = path;
        this.initPaths(dir);
    }
    sort(id = null) {
        let dir = id ? this.get(id) : this.root;
        dir.children.sort((a, b) => {
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
            // dirMap.pathMap.delete(dir.path);
            let path = `${pathStack.join("/")}${(_a = dir.ext) !== null && _a !== void 0 ? _a : ""}`;
            dir.path = path;
            dirMap.pathMap.set(path, dir);
            dir.children.forEach(subDir => recurse(subDir, dirMap));
            pathStack.pop();
        })(dir, this);
    }
    setRoot(dir) {
        var _a, _b;
        this.root = {
            id: (_a = dir === null || dir === void 0 ? void 0 : dir.id) !== null && _a !== void 0 ? _a : (0, Functions_1.genID)(),
            name: "",
            path: "",
            parentID: null,
            itemID: null,
            permissions: defaultPermissions(),
            children: (_b = dir === null || dir === void 0 ? void 0 : dir.children) !== null && _b !== void 0 ? _b : [],
            // type: ASSET_NAME.DIRECTORY,
        };
        this.idMap.set(this.root.id, this.root);
        return this.root;
    }
}
exports.DirectoryMap = DirectoryMap;
//# sourceMappingURL=Directory.js.map