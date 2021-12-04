export function deepEqual(object1: any, object2: any) {
    if (typeof object1 != "object" || typeof object2 != "object")
        return object1 === object2;
    if (object1 === null || object2 === null)
        return object1 === object2;
    if (!object1 || !object2)
        return false;
    let entries1 = Object.entries(object1);
    let entries2 = Object.entries(object2);

    if (entries1.length != entries2.length)
        return false;

    for (let i = 0; i < entries1.length; i++) {
        let key1 = entries1[i][0];
        let key2 = entries2[i][0];
        if (key1 != key2) return false;
        let val1 = entries1[i][1];
        let val2 = entries2[i][1];
        let equal = deepEqual(val1, val2);
        if (!equal) return false;
    }
    return true;
}

export function deepCopy(obj1: any, obj2: any) {
    for (let key in obj2) {
        let el = obj2[key];
        if (el === null || el === undefined) {
            obj1[key] = el;
        }
        else if (Array.isArray(el)) {
            el.map(item => JSON.parse(JSON.stringify(item)));
        }
        else if (typeof(el) == "object") {
            obj1[key] = {};
            deepCopy(obj1[key], obj2[key])
        }
        else {
            obj1[key] = obj2[key];
        }
    }
    return obj1;
}
export function deepClone(obj: any) {
    return deepCopy({}, obj);
}
export function isObject(object: any) {
    return object != null && typeof object === 'object';
}

export function sizeOfObj(obj: any) {
    return Buffer.byteLength(JSON.stringify(obj));
}