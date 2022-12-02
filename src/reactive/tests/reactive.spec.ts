import { reactive, isReactive } from '../reactive';

describe("init reactive", () => {
  test("reactive 返回的数据是响应式的", () => {
    const obj = {age: 18};
    const proxyObj = reactive(obj);
    expect(proxyObj).not.toBe(obj);
    expect(proxyObj.age).toBe(obj.age);

    // 是否响应式对象
    expect(isReactive(proxyObj)).toBe(true);
  });

  test('嵌套的数据响应式', () => {
    const original = {
      nested: {
        foo: 1,
      },
      arr: [{ bar: 2}]
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.arr)).toBe(true);
    expect(isReactive(observed.arr[0])).toBe(true);
  })
});
