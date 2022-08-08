import { track, trigger} from './effect';

export const reactive = <T>(obj): T => {
    return new Proxy(obj, {
        get (target, key) {
            const res = Reflect.get(target, key);

            // 收集依赖
            track(target, key);

            return res;
        },
        set (target, key, value) {
            const res = Reflect.set(target, key, value);

            // 触发依赖，更新视图
            // trigger(target, key, value);

            return res;
        }
    })
}