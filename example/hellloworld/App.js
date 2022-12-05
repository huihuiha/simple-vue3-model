import { h } from '../../lib/mini-vue.esm.js';

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
      },
      [h('p', { class: 'red' }, 'hi')]
      // "123123" + this.msg
    );
  },

  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
