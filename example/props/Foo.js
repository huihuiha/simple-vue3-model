import { h } from '../../lib/mini-vue.esm.js';
export const Foo = {
  setup(props) {
    console.log(props);

    // props -> readonly
  },

  render() {
    return h('div', {}, 'foo:' + this.count);
  },
};
