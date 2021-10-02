export declare class AutoSyncQueue {
    queue: (() => Promise<any>)[];
    enqueue(task: () => Promise<any>): void;
    dequeue(): void;
}
