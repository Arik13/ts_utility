export declare class AutoSyncQueue {
    queue: (() => Promise<void>)[];
    enqueue(task: () => Promise<void>): void;
    dequeue(): void;
}
