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

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj: any = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
});
