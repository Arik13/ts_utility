"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSyncQueue = void 0;
class AutoSyncQueue {
    constructor() {
        this.queue = [];
    }
    enqueue(task) {
        this.queue.push(task);
        if (this.queue.length == 1) {
            this.dequeue();
        }
    }
    dequeue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queue.length)
                return;
            (() => __awaiter(this, void 0, void 0, function* () {
                yield this.queue[0]();
                this.queue.shift();
                this.dequeue();
            }))();
        });
    }
}
exports.AutoSyncQueue = AutoSyncQueue;
//# sourceMappingURL=AutoSyncQueue.js.map