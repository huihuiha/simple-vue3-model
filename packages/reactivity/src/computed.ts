import { ReactiveEffect } from './effect';
class ComputedRefImpl {
  private _getter: any;
  private _dirty: boolean = true;
  private _value: any;
  private _effect: any;

  constructor(getter: any) {
    this._getter = getter;

    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    // 当依赖的响应式对象的值发生改变的时候，重新计算
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter: any) {
  return new ComputedRefImpl(getter);
}
