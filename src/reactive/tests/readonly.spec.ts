import { readonly } from '../reactive';

describe('readonly', () => {
  it('不可改写', () => {
    const obj = { foo: 1 };
    const wrapped = readonly(obj);
    expect(wrapped).not.toBe(obj);
    expect(wrapped.foo).toBe(1);
  });

  it('触发 readonly set的时候，作出警告', () => {
    console.warn = jest.fn();
    const user = readonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalledTimes(1);
  });
});
