import { render } from "./renderer";

export function createApp(rootComponent) {
  return {
    mount(rootContainer: any) {
      // 先Vnode
      // component -> root
      // 后续操作都会基于Vnode操作

      const vnode = createVnode(rootComponent, rootContainer);

      render(vnode, rootContainer);
    },
  };
}


