import { hasOwn } from '../shared/index';

const publicPropertiesMap = {
  $el: (i: any) => i.vnode.el,
  $slots: (i: any) => i.slots,
  $props: (i: any) => i.props,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key: string) {
    // setupState
    const { setupState, props } = instance;

    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    // key -> $el
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
