import { h, provide, inject } from '../../lib/mini-vue.esm.js';

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Provider2)]);
  },
};

const Provider2 = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooTwo');
    const foo = inject('foo');
    return {
      foo,
    };
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider2:' + this.foo), h(Consumer)]);
  },
};

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo');
    const bar = inject('barg', "default");
    return {
      foo,
      bar,
    };
  },
  render() {
    return h('div', {}, `consumer: ${this.foo} - ${this.bar}`);
  },
};

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', { class: 'red' }, 'hi'), h(Provider)]);
  },
};
