import { h, getCurrentInstance } from '../../lib/mini-vue.esm.js';
import { Foo } from './Foo.js';

window.self = null;
export const App = {
  name: 'App',
  render() {
    return h('div', {}, [h('p', {}, 'hi'), h(Foo)]);
  },

  setup() {
    const instachce = getCurrentInstance();
    console.log(instachce, "--------")
  },
};
