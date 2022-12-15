import { NodeTypes } from './ast';
import { TO_DISPLAY_STRING } from './runtimehelpers';

export function transform(root: any, options: any = {}) {
  const context = createTransformContext(root, options);

  // 1. 深度优先遍历
  traverseNode(root, context);
  // 2 修改 text content
  createRootCodegen(root);

  root.helpers = [...context.helpers.keys()];
}

function traverseNode(node: any, context: any) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node);
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key: string) {
      context.helpers.set(key, 1);
    },
  };

  return context;
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}
function traverseChildren(node: any, context: any) {
  const children = node.children;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    traverseNode(node, context);
  }
}
