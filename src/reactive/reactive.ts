export const reactive = <T>(obj): T => {
    return new Proxy(obj, {
        get (target, key) {
            const res = Reflect.get(target, key)
            return res;
        },
        set (target, key, value) {
            const res = Reflect.set(target, key, value);
            return res;
        }
    })
}