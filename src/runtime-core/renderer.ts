import { isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, container: any) {
  // patch
  // 是 element 那就处理element
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理组件
  // 判断是不是element
  if (typeof vnode.type === 'string') {
    processElement(vnode, container);
  } else if (isObject) {
    proccessComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  // init -> update
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = document.createElement(vnode.type);
  // srting array
  const { children, props } = vnode;

  // children 可以是string 或者 array
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  // props
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  container.append(el);
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((v: any) => {
    patch(v, container);
  });
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
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);
}
