export const App = {
  render() {
    return h('div', 'him ', this.msg);
  },

  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
