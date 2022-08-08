let effectActive;
export const effect = (fn: () => void) => {
    // 中间套一层对象，目的是用于存储
    const effectFn = new TargetKey(fn);

    // 执行effect传入的fn
    effectFn.run();
}

class TargetKey {
    public fn = () => {};

    constructor(fn) {
        this.fn = fn;
        effectActive = this;
    }

    run() {
        this.fn();
    }
}


// 跟踪依赖
const targetMap = new Map();
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
export const trigger = (traget, key, value) => {

}
