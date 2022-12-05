import { h } from '../../lib/mini-vue.esm.js';
import { Foo } from './Foo.js';

window.self = null;
export const App = {
  render() {
    window.self = this;
    return h('div', {}, [
      h('p', {}, 'APP'),
      h(Foo, {
        // on + Event
        onAddFoo(a, b) {
          console.log('onadd', a + b);
        },
      }),
    ]);
  },

  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
