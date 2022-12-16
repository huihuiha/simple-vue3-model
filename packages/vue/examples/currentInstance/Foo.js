import { h, getCurrentInstance } from '../../dist/simple-vue3-model.esm.js';
export const Foo = {
  name: 'Foo',
  setup() {
    const instance = getCurrentInstance();
    console.log('fOO:', instance);
    return {};
  },

  render() {
    return h('div', {}, 'foo');
  },
};
