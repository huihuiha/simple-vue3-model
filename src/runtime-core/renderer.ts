import { effect } from './../reactive/effect';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppApi } from './createApp';
import { Fragment, Text } from './vnode';
import { EMPTY_OBJ } from '../shared';

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode: any, container: any, parentComponent: any) {
    // patch
    // 是 element 那就处理element
    patch(null, vnode, container, parentComponent, null);
  }

  // n1 -> 老节点
  // n2 -> 新节点
  function patch(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    // shapreFlags
    // vnode -> flag
    // 处理组件
    // 判断是不是element
    const { shapeFlag, type } = n2;

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          proccessComponent(n1, n2, container, parentComponent, anchor);
        }
    }
  }

  function mountElement(
    vnode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    // srting array
    const { children, props, shapeFlag } = vnode;

    // children 可以是string 或者 array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(vnode.children, el, parentComponent, anchor);
    }
    // props
    for (const key in props) {
      const val = props[key];
      // 处理事件, 特性： on + eventname
      hostPatchProp(el, key, null, val);
    }

    // container.append(el);
    hostInsert(el, container, anchor);
  }

  function mountChildren(
    children: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    children.forEach((v: any) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }

  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function setupRenderEffect(
    instance: any,
    initialVNode: any,
    container: any,
    anchor: any
  ) {
    effect(() => {
      // init
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));

        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance, anchor);

        // element -> mounted
        initialVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        // update
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const preSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(preSubTree, subTree, container, instance, anchor);
      }
    });
  }

  function processFragment(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }

  function processText(n1: any, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function proccessComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  function processElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    if (!n1) {
      // init
      mountElement(n2, container, parentComponent, anchor);
    } else {
      // update
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function patchElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    // 情况一：foo之前的值和现在的值不一样 -> update
    // 情况二：null || undefined -> 删除
    // 情况三：bar这个属性在新的里面没有了 -> 删除

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);
    // 对比children
    patchChildren(n1, n2, el, parentComponent, anchor);
    // 对比props
    patchProps(el, oldProps, newProps);
  }

  function patchProps(el: any, oldProps: any, newProps: any) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const preProp = oldProps[key];
        const nextProp = newProps[key];

        if (preProp !== nextProp) {
          hostPatchProp(el, key, preProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function patchChildren(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const prevShapeFlag = n1.shapeFlag;
    const { shapeFlag } = n2;
    const c1 = n1.children;
    const c2 = n2.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的 children 清空
        unmountChildren(n1.children);
      }
      if (c1 !== c2) {
        // 2. 设置 text
        hostSetElementText(container, c2);
      }
    } else {
      // 新的是一个数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '');
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  function patchKeyedChildren(
    c1: any,
    c2: any,
    container: any,
    parentComponent: any,
    parentAnchor: any
  ) {
    const l2 = c2.length;
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    // 左侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    // 右侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];

      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }

      e1--;
      e2--;
    }

    //  3.新的比老的多，创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos + 1 < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      // 中间对比
      let s1 = i;
      let s2 = i;

      const toBePathed = e2 - s2 + 1;
      let patched = 0;
      const keyToNewIndexMap = new Map();

      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];

        if (patched >= toBePathed) {
          hostRemove(prevChild.el);
          continue;
        }

        let newIndex: any;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (let j = s2; j < e2; j++) {
            if (isSomeVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }

        if (newIndex === undefined) {
          hostRemove(prevChild.el);
        } else {
          patch(prevChild, c2[newIndex], container, parentAnchor, null);
          patched++;
        }
      }
    }
  }

  function isSomeVNodeType(n1: any, n2: any) {
    // type 和 key 确定是不是用一个节点
    return n1.type === n2.type && n1.key === n2.key;
  }

  function unmountChildren(children: any) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      // remove
      hostRemove(el);
    }
  }

  return {
    createApp: createAppApi(render),
  };
}
