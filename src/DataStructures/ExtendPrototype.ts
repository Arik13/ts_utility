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