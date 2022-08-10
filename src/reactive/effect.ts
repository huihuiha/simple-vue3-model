// 存放当前 dep 实例
let activeEffect;
// 存放targer -> key -> value 的关系
const targetMap = new Map();

// 相当于对 fn 做了一层封装
class ActiveEffect {
  active = true;
  // effect 传入的fn
  public _fn = () => {};
  deps = [];

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    this.deps.forEach((dep: any) => {
      dep.delete(this);
    });
  }
}

// effect函数
export const effect = (fn: () => any, option: any = {}) => {
  // 中间套一层对象，目的是用于存储
  const _effect = new ActiveEffect(fn, option.scheduler);

  // 执行effect传入的fn
  _effect.run();

  const bindFn = _effect.run.bind(_effect);
  bindFn.effect = _effect;

  return bindFn;
};

// 跟踪依赖
export const track = (target, key) => {
  // { target: { key: [dep1, dep2, dep3]} }

  let depsMap = targetMap.get(target);
  // 没有deps依赖，则target -> key的关系
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  // 没有key对应的deps，则生成 key -> deps的依赖
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  deps.add(activeEffect);

  activeEffect && activeEffect.deps.push(deps);
};

// 触发依赖
export const trigger = (traget, key) => {
  const depsMap = targetMap.get(traget);

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
