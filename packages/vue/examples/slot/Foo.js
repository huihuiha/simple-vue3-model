import { h, renderSlots } from '../../dist/simple-vue3-model.esm.js';
export const Foo = {
  name: 'Foo',
  setup() {
    return {};
  },

  render() {
    const foo = h('p', {}, 'foo');
    // 1. 获取到渲染的元素
    // 具名插槽
    // 2. 获取到渲染的位置
    // 作用域插槽
    const age = 18;

    return h('div', {}, [
      renderSlots(this.$slots, 'header', {age}),
      foo,
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
