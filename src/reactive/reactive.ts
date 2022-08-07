export const reactive = (obj = {}) => {
    return new Proxy(obj, {
        get (target, value) {
            
        }
    })
}