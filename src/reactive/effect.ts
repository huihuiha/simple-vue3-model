import { extend } from './../shared/index';

let shouldTrack: any;

// 相当于对 fn 做了一层封装
class ReactiveEffect {
  active = true;
  // effect 传入的fn
  public _fn = () => {};
  // 存放的是不同的dep
  deps = [];
  onStop?: () => void;

  constructor(fn: () => void, public scheduler?: any) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    if(!this.active) {
      return this._fn();
    }

    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();
    // reset
    shouldTrack = false;

    return result;
  }

  stop() {
    if (this.active) {
      if (this.onStop) {
        this.onStop();
      }
      cleanupEffect(this);
      this.active = false;
    }
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

// 存放当前对象的 dep 实例
let activeEffect: any;
// effect函数
export const effect = (fn: () => void, options: any = {}) => {
  // 中间套一层对象，目的是用于存储
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // extend
  extend(_effect, options);

  // 执行effect函数传入的fn
  _effect.run();

  // 修改this的执行
  const bindFn = _effect.run.bind(_effect);
  // 该操作是为了调用stop方法的时候使用
  bindFn.effect = _effect;

  return bindFn;
};

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

// 存放targer -> key -> value 的关系
const targetMap = new Map();
// 跟踪依赖
export const track = (target: any, key: string) => {
  // 反向收集dep
  if (!isTracking()) return;

  // { target: { key: [dep1, dep2, dep3]} }
  let depsMap = targetMap.get(target);
  // 没有deps依赖，则target -> key的关系
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  // 没有key对应的deps，则生成 key -> deps的依赖
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  // 已经在dep中
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect && activeEffect.deps.push(dep);
};

// 触发依赖
export const trigger = (traget: any, key: string) => {
  // 获取对象的 map
  const depsMap = targetMap.get(traget);

  // 获取对应key所收集的依赖（fn）
  const deps = depsMap.get(key);

  for (let dep of deps) {
    if (dep.scheduler) {
      dep.scheduler();
    } else {
      dep.run();
    }
  }
};

// stop
export const stop = (runner: any) => {
  runner.effect.stop();
};
