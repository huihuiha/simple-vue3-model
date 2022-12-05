// 创建组件实例
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };

  return component;
}

export function setupComponent(instacnce) {
  // initProps
  // initSlots

  // 初始化有状态的组件
  setupStatefulComponent(instacnce);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        // setupState
        const { setupState } = instance;
        if (key in setupState) {
          return setupState[key];
        }
      },
    }
  );

  const { setup } = Component;

  if (setup) {
    // 可以是function、object
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  instance.render = Component.render;
}
