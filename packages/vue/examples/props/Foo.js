import { h } from '../../dist/simple-vue3-model.esm.js';
export const Foo = {
  setup(props) {
    console.log(props);

    // props -> readonly
  },

  render() {
    return h('div', {}, 'foo:' + this.count);
  },
};
