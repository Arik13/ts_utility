import "module-alias/register";
// import "@util/PrototypeExtensions";

// import { DirectoryMap, genID } from "@util/Directory";
// import { deeplog } from "@util/Functions";
// let dirMap = new DirectoryMap();

// let newDir1 = dirMap.createDir("test", dirMap.root.id);
// let newDir2 = dirMap.createDir("test", dirMap.root.id);
// let newAssetDir = dirMap.createAssetDir(
//     {dirID: null, id: genID(), name: "asset"},
//     ".ass",
//     newDir1.id,
// );
// deeplog(dirMap.root);
// dirMap.move(newAssetDir.id, newDir1.id);
// dirMap.rename(newAssetDir.id, "RENAMED ASSET");
// dirMap.rename(newAssetDir.id, "RENAMED ASSET");
// dirMap.rename(newAssetDir.id, "RENAMED ASSET");
// // dirMap.rename(newDir1.id, "RENAMED DIRECTORY");
// deeplog(dirMap.root);






// import {deepClone} from "@util/Objects";
// import * as fs from "fs";
// const data = require("./ikra.json");
// console.log(data);
// console.time("Stringify/Parse");
// let clone1 = JSON.parse(JSON.stringify(data));
// console.timeEnd("Stringify/Parse");
// console.time("deepClone");
// let clone2 = deepClone(data);
// console.timeEnd("deepClone");