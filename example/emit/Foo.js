import { h } from '../../lib/mini-vue.esm.js';
export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add-foo', 1, 2);
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitbutn'
    );
    const p = h('p', {}, 'foo');
    return h('div', {}, [p, btn]);
  },
};
