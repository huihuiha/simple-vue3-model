import { isReadonly, shallowReadonly } from '../src/reactive';

describe('shallowReadonly', () => {
  it('表面只读，深层次不只读', () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });

  it('触发 readonly set的时候，作出警告', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({ age: 10 });
    user.age = 11;
    expect(console.warn).toBeCalledTimes(1);
  });
});
