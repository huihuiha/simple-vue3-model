import { h, createTextVNode } from '../../lib/mini-vue.esm.js';
import { Foo } from './Foo.js';

export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'ggg');
    // const foo = h(Foo, {}, [h('p', {}, "123"), h('p', {}, "456")]);
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, 'header' + age),
          createTextVNode('Nihao'),
        ],
        footer: () => h('p', {}, 'footer'),
      }
    );
    return h('div', {}, [app, foo]);
  },

  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
