// 存放当前 dep 实例
let effectActive;
// 存放targer -> key -> value 的关系
const targetMap = new Map();

// 相当于对fn做了一层封装
class TargetKey {
    public _fn = () => {};

    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {
        effectActive = this;
        return this._fn();
    }
}

export const effect = (fn: () => any, option: any = {}) => {
    // 中间套一层对象，目的是用于存储
    const effectFn = new TargetKey(fn, option.scheduler);

    // 执行effect传入的fn
    effectFn.run();

    return effectFn.run.bind(effectFn);
}

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

    deps.add(effectActive);
}




// 触发依赖
export const trigger = (traget, key) => {
    const depsMap = targetMap.get(traget);

    const deps = depsMap.get(key);

    for (let dep of deps) {
        if (dep.scheduler) {
            dep.scheduler();
        }
        else {
            dep.run();
        }
    }
}
