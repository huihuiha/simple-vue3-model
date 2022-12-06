import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppApi } from './createApp';
import { Fragment, Text } from './vnode';

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;

  function render(vnode: any, container: any, parentComponent: any) {
    // patch
    // 是 element 那就处理element
    patch(vnode, container, parentComponent);
  }

  function patch(vnode: any, container: any, parentComponent: any) {
    // shapreFlags
    // vnode -> flag
    // 处理组件
    // 判断是不是element
    const { shapeFlag, type } = vnode;

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          proccessComponent(vnode, container, parentComponent);
        }
    }
  }

  function processElement(vnode: any, container: any, parentComponent: any) {
    // init -> update
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent: any) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    // srting array
    const { children, props, shapeFlag } = vnode;

    // children 可以是string 或者 array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(vnode, el, parentComponent);
    }
    // props
    for (const key in props) {
      const val = props[key];
      // 处理事件, 特性： on + eventname
      hostPatchProp(el, key, val);
    }

    // container.append(el);
    hostInsert(el, container);
  }

  function mountChildren(vnode: any, container: any, parentComponent: any) {
    vnode.children.forEach((v: any) => {
      patch(v, container, parentComponent);
    });
  }

  function proccessComponent(vnode: any, container: any, parentComponent: any) {
    mountComponent(vnode, container, parentComponent);
  }
  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent: any
  ) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container, instance);

    // element -> mounted
    initialVNode.el = subTree.el;
  }
  function processFragment(vnode: any, container: any, parentComponent: any) {
    mountChildren(vnode, container, parentComponent);
  }
  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp: createAppApi(render),
  };
}
