"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedList = void 0;
class IndexOutOfRangeError extends Error {
    constructor() {
        super("Index out of range");
    }
}
class LinkedList {
    constructor(array) {
        this.init(array);
    }
    get(index) {
        if (index >= this.size || index < 0)
            throw new IndexOutOfRangeError();
        return this.getNode(index).data;
    }
    set(index, data) {
        if (index >= this.size || index < 0)
            throw new IndexOutOfRangeError();
        this.getNode(index).data = data;
    }
    insert(index, data) {
        if (index > this.size || index < 0)
            throw new IndexOutOfRangeError();
        let nextNode = this.getNode(index);
        let prevNode = nextNode.prev;
        let newNode = {
            next: nextNode,
            prev: prevNode,
            data: data,
        };
        prevNode.next = newNode;
        nextNode.prev = newNode;
        this.size++;
    }
    delete(index) {
        if (index >= this.size || index < 0)
            throw new IndexOutOfRangeError();
        let deleteNode = this.getNode(index);
        let prevNode = deleteNode.prev;
        let nextNode = deleteNode.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
        this.size--;
    }
    push(...data) {
        for (let i = 0; i < data.length; i++) {
            let lastNode = this.tail.prev;
            let newNode = {
                next: this.tail,
                prev: lastNode,
                data: data[i],
            };
            lastNode.next = newNode;
            this.tail.prev = newNode;
            this.size++;
        }
    }
    pop() {
        if (this.size == 0)
            throw new Error("Can not pop element from empty list");
        let node = this.tail.prev;
        if (node.type == "head")
            return null;
        let prevNode = node.prev;
        prevNode.next = this.tail;
        this.size--;
        return node.data;
    }
    toArray() {
        let arr = [];
        this.forEach((value) => {
            arr.push(value);
        });
        return arr;
    }
    toString() {
        return this.toArray().toString();
    }
    find(predicate) {
        let data = null;
        this.traverse((node, index) => {
            if (predicate(node.data, index)) {
                data = node.data;
                return true;
            }
        });
        return data;
    }
    findIndex(predicate) {
        let returnedIndex = -1;
        this.traverse((node, index) => {
            if (predicate(node.data, index)) {
                returnedIndex = index;
                return true;
            }
        });
        return returnedIndex;
    }
    indexOf(searchElement) {
        let returnedIndex = -1;
        this.traverse((node, index) => {
            if (searchElement === node.data) {
                returnedIndex = index;
                return true;
            }
        });
        return returnedIndex;
    }
    includes(searchElement) {
        let doesInclude = false;
        this.traverse(node => doesInclude = searchElement === node.data);
        return doesInclude;
    }
    shift() {
        let node = this.head.next;
        if (node.type == "tail")
            return null;
        let nextNode = node.next;
        this.head.next = nextNode;
        nextNode.prev = this.head;
        this.size--;
        return node.data;
    }
    unshift(...items) {
        for (let i = 0; i < items.length; i++) {
            this.insert(0, items[i]);
        }
        return this.size;
    }
    map(mapFunc) {
        let mappedLL = new LinkedList();
        this.traverse((node, index) => mappedLL.push(mapFunc(node.data, index)));
        return mappedLL;
    }
    reduce(reducer) {
        let node = this.head.next;
        if (node.type == "tail")
            return null;
        if (node.next.type == "tail")
            return node.data;
        let currentIndex = 1;
        let accumulator = node.data;
        node = node.next;
        while (node.type != "tail") {
            accumulator = reducer(accumulator, node.data, currentIndex);
            node = node.next;
            currentIndex++;
        }
        return accumulator;
    }
    reduceRight(reducer) {
        let node = this.tail.prev;
        if (node.type == "head")
            return null;
        if (node.prev.type == "head")
            return node.data;
        let currentIndex = this.size - 2;
        let accumulator = node.data;
        node = node.prev;
        while (node.type != "head") {
            accumulator = reducer(accumulator, node.data, currentIndex);
            node = node.prev;
            currentIndex--;
        }
        return accumulator;
    }
    filter(predicate) {
        let filterLL = new LinkedList();
        this.traverse((node, index) => {
            if (predicate(node.data, index)) {
                filterLL.push(node.data);
            }
        });
        return filterLL;
    }
    forEach(callback) {
        this.traverse((node, index) => callback(node.data, index));
    }
    swap(indexOne, indexTwo) {
        if (indexOne >= this.size || indexOne < 0 ||
            indexTwo >= this.size || indexTwo < 0)
            throw new IndexOutOfRangeError();
        let node1 = this.getNode(indexOne);
        let node2 = this.getNode(indexTwo);
        let swapVar = node1.data;
        node1.data = node2.data;
        node2.data = swapVar;
    }
    some(predicate) {
        let isSome = false;
        this.traverse((node, index) => isSome = predicate(node.data, index));
        return isSome;
    }
    every(predicate) {
        let isEvery = true;
        this.traverse((node, index) => {
            return !(isEvery = predicate(node.data, index));
        });
        return isEvery;
    }
    // Don't hate me I was lazy
    sort(comparator) {
        let array = this.toArray();
        array.sort(comparator);
        this.init(array);
    }
    rotateLeft() {
        let leftNode = this.head.next;
        let rightNode = this.tail.prev;
        if (leftNode.type == "tail")
            return;
        if (this.size == 1)
            return;
        // Attach left side
        this.head.next = leftNode.next;
        this.head.next.prev = this.head;
        // Attach right side
        rightNode.next = leftNode;
        leftNode.prev = rightNode;
        leftNode.next = this.tail;
        this.tail.prev = leftNode;
    }
    rotateRight() {
        let leftNode = this.head.next;
        let rightNode = this.tail.prev;
        if (leftNode.type == "tail")
            return;
        // Attach left side
        this.tail.prev = rightNode.prev;
        this.tail.prev.next = this.tail;
        // Attach right side
        leftNode.prev = rightNode;
        rightNode.next = leftNode;
        rightNode.prev = this.head;
        this.head.next = rightNode;
    }
    move(startIndex, endIndex) {
        if (startIndex >= this.size || startIndex < 0 ||
            endIndex >= this.size || endIndex < 0)
            throw new IndexOutOfRangeError();
        let node1 = this.getNode(startIndex);
        this.delete(startIndex);
        this.insert(endIndex, node1.data);
    }
    getNode(index) {
        let node = this.head.next;
        let currentIndex = 0;
        while (node.type != "tail" && currentIndex < index) {
            node = node.next;
            currentIndex++;
        }
        return node;
    }
    traverse(accessor) {
        let node = this.head.next;
        let index = 0;
        while (node.type != "tail" && !accessor(node, index)) {
            node = node.next;
            index++;
        }
    }
    init(array) {
        this.head = {
            next: null,
            prev: null,
            data: null,
            type: "head",
        };
        this.tail = {
            next: null,
            prev: this.head,
            data: null,
            type: "tail",
        };
        this.head.next = this.tail;
        this.size = 0;
        if (array) {
            for (let i = 0; i < array.length; i++) {
                this.push(array[i]);
            }
        }
    }
}
exports.LinkedList = LinkedList;
//# sourceMappingURL=LinkedList.js.map