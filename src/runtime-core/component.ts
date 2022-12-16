import { proxyRefs } from '../reactive';
import { shallowReadonly } from '../reactive/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublishInstance';
import { initSlots } from './componentSlots';
// 创建组件实例
export function createComponentInstance(vnode: any, parent: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    component: null,
    // 下次要更新的虚拟节点
    next: null,
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {},
  };

  component.emit = emit.bind({}, component) as any;

  return component;
}

export function setupComponent(instance: any) {
  // 初始化props
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  // 初始化有状态的组件
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    setCurrentInstance(instance);
    // 可以是function、object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template);
    }
  }

  // temlate
  instance.render = Component.render;
}

let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

let compiler: any;

export function registerRuntimeCompiler(_compiler: any) {
  compiler = _compiler;
}
