import { effect } from '../effect';
import { reactive } from '../reactive';
import { ref, isRef, unRef } from '../ref';

describe('ref', () => {
  it('基本使用', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  it('ref 包裹的对象返回响应式对象', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // 相同的内容不差发
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it('嵌套对象的数据响应', () => {
    const obj = ref({ count: 1 });
    let dummy;
    effect(() => {
        dummy = obj.value.count;
    });
    expect(dummy).toBe(1);
    obj.value.count = 2;
    expect(dummy).toBe(2);
  });

  it('isRef', () => {
    const a = ref(1);
    const user = reactive({
        age: 1
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

  it('unRef', () => {
    const a = ref(1);
    const user = reactive({
        age: 1
    });
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
    expect(unRef(user)).toBe(user);
  })
});
