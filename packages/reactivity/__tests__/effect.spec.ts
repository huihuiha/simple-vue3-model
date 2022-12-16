import { effect, stop } from '../src/effect';
import { reactive } from '../src/reactive';
import { vi } from 'vitest';

describe('effect', () => {
  it('函数参数是否自动执行', () => {
    const obj: any = reactive({ age: 18 });
    let num = 0;
    effect(() => {
      num = obj.age + 1;
    });
    expect(num).toBe(19);

    // update
    obj.age++;
    expect(num).toBe(20);
  });

  it('effect 里面的响应式数据发生变化的时候，是否会触发依赖函数执行', () => {
    const obj: any = reactive({ age: 18 });
    let num;
    effect(() => {
      num = obj.age + 1;
    });
    obj.age++;
    expect(num).toBe(20);
  });

  it('effect 函数返回runner，runner执行，fn也会执行，当调用runner的时候，能够拿到fn return 的结果', () => {
    // 1.effect(fn) -> funciton (runner) -> fn -> return
    let foo = 10;
    const runner: any = effect(() => {
      foo += 1;
      return 'foo';
    });
    expect(foo).toBe(11);
    const res = runner();
    expect(foo).toBe(12);
    expect(res).toBe('foo');
  });

  it('scheduler', () => {
    // 1.通过effect的第二个参数给定一个scheduler的fn
    // 2.effect 第一次执行的时候，绘制行fn
    // 3.当响应式对象set、update不会执行fn，而是执行schedukar
    // 4.当执行runner的时候，则执行fn
    let dummy;
    let run: any;
    const scheduler = vi.fn(() => {
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

  it('stop', () => {
    // 调用stop方法，就不更新响应式数据里面的值了
    let dummy;
    const obj: any = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    // 调用stop方法
    stop(runner);
    obj.prop++;
    // obj.prop = 3;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = vi.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
