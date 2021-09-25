export class AutoSyncQueue {
    queue: (() => Promise<void>)[] = [];
    enqueue(task: () => Promise<void>) {
        this.queue.push(task);
        if (this.queue.length == 1) {
            this.dequeue();
        }
    }
    dequeue() {
        if (!this.queue.length) return;
        (async () => {
            await this.queue.shift()();
            this.dequeue();
        })();
    }
}