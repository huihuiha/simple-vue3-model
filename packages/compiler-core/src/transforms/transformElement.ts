import { createVNodeCall, NodeTypes } from '../ast';
import { CREATE_ELEMENT_VNODE } from '../runtimehelpers';

export function transformElement(node: any, context: any) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      context.helper(CREATE_ELEMENT_VNODE);

      // tag
      const vnodeTag = `'${node.tag}'`;

      // props
      let vnodeProps: any;

      // children
      const children = node.children;
      let vnodeChildren = children[0];

      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      );
    }
  }
}
