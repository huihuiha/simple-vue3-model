import { reactive } from '../reactive';

describe("init reactive", () => {
  test("return value is ideal", () => {
    const obj = {age: 18};
    const proxyObj = reactive(obj);
    expect(proxyObj).not.toBe(obj);
    expect(proxyObj.age).toBe(obj.age);
  });
});
