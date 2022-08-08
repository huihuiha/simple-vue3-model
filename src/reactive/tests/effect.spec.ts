import { effect } from "../effect";
import { reactive } from "../reactive";

interface ObjInterface {
  age: number;
}

describe("effect", () => {
  it("函数参数是否自动执行", () => {
    const obj = reactive({ age: 18 }) as ObjInterface;
    let num = 0;
    effect(() => {
      num = obj.age + 1;
    });
    expect(num).toBe(19);
  });

  it("effect 里面的响应式数据发生变化的时候，是否会触发依赖函数执行", () => {
    const obj = reactive({ age: 18 }) as ObjInterface;
    let num = 0;
    effect(() => {
      num = obj.age + 1;
    });
    obj.age++;
    expect(num).toBe(20);
  });
});
