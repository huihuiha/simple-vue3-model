import { createVNode } from './vnode';

export function createAppApi(render) {
  return function createApp(rootComponent: any) {
    return {
      mount(rootContainer: any) {
        // 先Vnode
        // component -> root
        // 后续操作都会基于Vnode操作

        const vnode = createVNode(rootComponent, rootContainer);

        render(vnode, rootContainer, null);
      },
    };
  };
}
