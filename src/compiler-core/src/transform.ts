export function transform(root: any, options: any = {}) {
  const context = createTransformContext(root, options);

  // 1. 深度优先遍历
  traverseChildren(root, context);
  // 2 修改 text content
  createRootCodegen(root);
}

function traverseChildren(node: any, context: any) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node);
  }

  const children = node.children;

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseChildren(node, context);
    }
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };

  return context;
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}
