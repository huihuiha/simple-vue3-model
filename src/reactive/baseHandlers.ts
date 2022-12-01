import { track, trigger } from './effect';
import { ReactiveFlags } from './reactive';

const get = createGetter(false);
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
  return function get(target, key) {
    // 获取结果
    const res = Reflect.get(target, key);

    // 判断是否是响应式数据
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }

    // 判断是否是只读属性
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    // 收集依赖
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    // 获取结果
    const res = Reflect.set(target, key, value);
    // 触发依赖，更新视图
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,

  set(target, key, value) {
    console.warn(`key: ${key} set 失败，因为 target 是 readonly`);
    return true;
  },
};
