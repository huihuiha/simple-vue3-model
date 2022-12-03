import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('基本使用', () => {
    // .value
    // 1.缓存
    const user = reactive({
      age: 1,
    });

    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });

  it('懒惰特性', () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy(没有调用cValue，就不再调用)
    expect(getter).not.toHaveBeenCalled();

    // 调用值
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // 不再计算
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // 不再计算，直到再次需要
    value.foo = 2;  // trigger -> effect -> get 重新执行
    expect(getter).toHaveBeenCalledTimes(1);

    // 需要这个值的时候，需要重新计算
    expect(cValue.value).toBe(2);
    expect(getter).toHaveReturnedTimes(2);
  });
});
