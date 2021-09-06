import { LinkedList } from "./LinkedList";

const runTests = () => {
    // GET Test
    let ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    console.info("Testing GET: ", ll.get(1) == 1);

    // SET Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    ll.set(1, 2)
    console.info("Testing SET: ", ll.get(1) == 2);

    // INSERT Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    ll.insert(1, 2);
    console.info("Testing INSERT: ",  ll.get(1) == 2 && ll.size == 11);

    // DELETE Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    ll.delete(1);
    console.info("Testing DELETE: ",  ll.size == 9 && ll.get(1) == 2);

    // PUSH Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let pushValid = true;
    let arr = ll.toArray();
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != i) pushValid = false;
    }
    console.info("Testing PUSH: ",  ll.size == 10 && pushValid);

    // POP Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let poppedVal = ll.pop();
    console.info("Testing POP: ",  ll.size == 9 && poppedVal == 9);

    // FIND Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let foundVal = ll.find((val, index) => val == 5);
    console.info("Testing FIND: ",  foundVal == 5);

    // FIND INDEX Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let foundIndex = ll.findIndex((val, index) => val == 5);
    console.info("Testing FIND INDEX: ",  foundIndex == 5);

    // INDEX OF Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let foundIndexOf = ll.indexOf(5);
    console.info("Testing INDEX OF: ",  foundIndexOf == 5);

    // INCLUDES Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    console.info("Testing INCLUDES: ",  ll.includes(5));

    // SHIFT Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let shiftedVal = ll.shift();
    console.info("Testing SHIFT: ",  ll.size == 9 && shiftedVal == 0 && ll.get(0) == 1);

    // UNSHIFT Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let length = ll.unshift(0, 0);
    console.info("Testing UNSHIFT: ",  ll.size == 12 && length == 12 && ll.get(1) == 0);

    // MAP Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let newLL = ll.map((val) => { val*2 });
    let mapValid = true;
    let arr2 = ll.toArray();
    for (let i = 0; i < arr2.length; i++) {
        if (arr2[i] != i*2) pushValid = false;
    }
    console.info("Testing MAP: ",  newLL.size == 10 && mapValid);

    // REDUCE Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let reduction = ll.reduce((acc, val) => acc + val);
    console.info("Testing REDUCE: ",  reduction == 45);

    // REDUCE RIGHT Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let reduction2 = ll.reduceRight((acc, val) => acc - val);
    console.info("Testing REDUCE RIGHT: ",  reduction2 == -27);

    // FILTER Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    let filterLL = ll.filter((val, index) => val % 2 == 0);
    let filterArr = filterLL.toArray();
    let filterValid = true;
    for (let i = 0; i < filterArr.length; i++) {
        if (filterArr[i] != i*2) filterValid = false;
    }
    console.info("Testing FILTER: ",  filterArr.length == 5 && filterValid);

    // SWAP Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    ll.swap(0, 1);
    console.info("Testing SWAP: ",  ll.get(0) == 1 && ll.get(1) == 0);

    // SOME Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    console.info("Testing SOME: ",  ll.some(val => val == 3));

    // EVERY Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    console.info("Testing EVERY: ",  ll.every(val => val != 11));

    // SORT Test
    ll = new LinkedList<number>();
    ll.push(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
    ll.sort((a, b) => a - b);
    let sortValid = true;
    let sortArr = ll.toArray();
    for (let i = 0; i < sortArr.length; i++) {
        if (sortArr[i] != i) sortValid = false;
    }
    console.info("Testing SORT: ", sortValid);

    // ROTATE LEFT Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    ll.rotateLeft();
    console.info("Testing ROTATE LEFT: ",  ll.get(0) == 1);

    // ROTATE RIGHT Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    ll.rotateRight();
    console.info("Testing ROTATE RIGHT: ",  ll.get(0) == 9);

    // TO STRING Test
    ll = new LinkedList<number>();
    ll.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    console.info("Testing TO STRING: ",  ll.toString() == "0,1,2,3,4,5,6,7,8,9");

    ll = new LinkedList<number>();
    console.info(ll);
    console.info(ll.toArray());
}