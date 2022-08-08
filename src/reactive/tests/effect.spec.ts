import { effect } from "../effect";
import { reactive } from '../reactive';

interface ObjInterface{
  age: number
}


describe("init effect", () => {
  it("effect is run", () => {
    const obj = reactive({ age: 18 }) as ObjInterface;
    effect(() => {
      obj.age++;
    });
    expect(obj.age).toBe(19);
  });
});
