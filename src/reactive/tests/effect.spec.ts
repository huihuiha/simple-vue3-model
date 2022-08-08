import { effect } from "../effect";
import { reactive } from "../reactive";


describe("effect", () => {
  it("函数参数是否自动执行", () => {
    const obj: any = reactive({ age: 18 });
    let num = 0;
    effect(() => {
      num = obj.age + 1;
    });
    expect(num).toBe(19);
  });

  it("effect 里面的响应式数据发生变化的时候，是否会触发依赖函数执行", () => {
    const obj: any = reactive({ age: 18 });
    let num;
    effect(() => {
      num = obj.age + 1;
    });
    obj.age++;
    expect(num).toBe(20);
  });


  it('effect 函数返回runner，runner执行，fn也会执行', () => {
    let foo = 10;
    const runner: any = effect(() => {
      foo += 1;
      return 'foo';
    })
    expect(foo).toBe(11);
    const res = runner();
    expect(foo).toBe(12);
    expect(res).toBe('foo');
  })
});
