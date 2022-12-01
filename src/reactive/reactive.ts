import { track, trigger } from './effect';

export function reactive(raw: Record<string, any>) {
  return new Proxy(raw, {
    get(target, key) {
      // 获取结果
      const res = Reflect.get(target, key);
      // 收集依赖
      track(target, key);
      return res;
    },
    set(target, key, value) {
      // 过去结果
      const res = Reflect.set(target, key, value);
      // 触发依赖，更新视图
      trigger(target, key);
      return res;
    },
  });
}
