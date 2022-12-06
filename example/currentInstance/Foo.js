import { h, getCurrentInstance } from '../../lib/mini-vue.esm.js';
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
