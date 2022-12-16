import { readonly, isReadonly } from '../src/reactive';

describe('readonly', () => {
  it('不可改写', () => {
    const obj = { foo: 1 };
    const wrapped = readonly(obj);
    expect(wrapped).not.toBe(obj);
    expect(wrapped.foo).toBe(1);
    // 判断是否是只读属性
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(obj)).toBe(false);
  });

  it('触发 readonly set的时候，作出警告', () => {
    console.warn = jest.fn();
    const user = readonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalledTimes(1);
  });

  it('嵌套是否只读', () => {
    const obj = { foo: 1, bar: { baz: 2} };
    const wrapped = readonly(obj);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(obj.bar)).toBe(false);
  })
});
