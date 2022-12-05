import { shallowReadonly } from '../reactive/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublishInstance';
import { initSlots } from './componentSlots';
// 创建组件实例
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {}
  };

  component.emit = emit.bind({}, component) as any;

  return component;
}

export function setupComponent(instance: any) {
  // 初始化props
  initProps(instance, instance.vnode.props);
  console.log(instance.vnode)
  initSlots(instance, instance.vnode.children);

  // 初始化有状态的组件
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  instance.proxy = new Proxy(
    {_: instance},
    PublicInstanceProxyHandlers
  );

  const { setup } = Component;

  if (setup) {
    // 可以是function、object
    const setupResult = setup(shallowReadonly(instance.props),{
      emit: instance.emit
    });

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  instance.render = Component.render;
}
