import { h } from '../../dist/simple-vue3-model.esm.js';

window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
      },
      // [h('p', { class: 'red' }, 'hi'), ]
      '123123' + this.msg
    );
  },

  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
