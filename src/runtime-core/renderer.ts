import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch
  // TODO: 判断Vnode是不是一个element
  // 是 element 那就处理element
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理组件

  // 判断是不是element
  proccessComponent(vnode, container);
}

function proccessComponent(vnode, container) {
  mountComponent(vnode, container);
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);
}
