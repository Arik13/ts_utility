export class AutoSyncQueue {
    queue: (() => Promise<any>)[] = [];
    enqueue(task: () => Promise<any>) {
        this.queue.push(task);
        if (this.queue.length == 1) {
            this.dequeue();
        }
    }
    async dequeue() {
        if (!this.queue.length) return;
        (async () => {
            await this.queue[0]();
            this.queue.shift();
            this.dequeue();
        })();
    }
}