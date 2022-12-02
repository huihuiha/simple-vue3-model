import { isObject } from './../shared/index';
import { trackEffects, triggerEffects, isTracking } from './effect';
import { hasChanged } from '../shared';
import { reactive } from './reactive';

// 因为 ref 传入的可以是基础类型
// 基础类型是不能够使用 Proxy 进行代理
// 因此才封装 RefImpl 来实例化一个对象
class RefImpl {
  private _value: any;
  public dep: any;
  private _rawValue: any;
  constructor(value: any) {
    this._rawValue = value;
    // 1.如果value 是对象，用reactive包裹下
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    // 修改相同值的时候不做任何处理
    //  对比的时候需要注意对象（响应式 vs 普通对象）
    if (!hasChanged(newVal, this._rawValue)) return;

    // 1.先修改value的值
    this._rawValue = newVal;
    this._value = convert(newVal);
    // 2.再进行effect的通知
    triggerEffects(this.dep);
  }
}

export function ref(value: any) {
  return new RefImpl(value);
}

function trackRefValue(ref: any) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value;
}
