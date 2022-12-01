import { extend } from './../shared/index';

// 相当于对 fn 做了一层封装
class ReactiveEffect {
  active = true;
  // effect 传入的fn
  public _fn = () => {};
  // 存放的是不同的dep
  deps = [];
  onStop?: () => void;

  constructor(fn: () => void, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
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

function cleanupEffect(effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect);
  })
}

// 存放当前对象的 dep 实例
let activeEffect;
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

// 存放targer -> key -> value 的关系
const targetMap = new Map();
// 跟踪依赖
export const track = (target, key) => {
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

  dep.add(activeEffect);

  // 反向收集dep
  activeEffect && activeEffect.deps.push(dep);
};

// 触发依赖
export const trigger = (traget, key) => {
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
