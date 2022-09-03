export let extendPrototype = (prototype: any, methods: any) => {
    for (let key in methods) {
        if (prototype.hasOwnProperty(key)) {
            throw new Error(`${prototype.constructor?.name} already has property ${key}`)
        }
        Object.defineProperty(prototype, key, {
            value: methods[key],
            enumerable: false,
        });
    }
}
export let extendPrototypeFromClassObj = (prototype: any, obj: any) => {
    let objProto = Object.getPrototypeOf(obj);
    let methods = Object.getOwnPropertyNames(objProto).slice(1).map(k => [k, objProto[k]]);
    let methodObject = Object.fromEntries(methods);
    extendPrototype(prototype, methodObject);
    extendPrototype(prototype, obj);
}