import { reactive } from '../reactive';

describe("init reactive", () => {
  test("return value is ideal", () => {
    const obj = {age: 18};
    const proxyObj = reactive<typeof obj>(obj);
    expect(proxyObj.age).toBe(obj.age);
  });
});
