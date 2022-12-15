export function generate(ast: any) {
    console.log(ast)
  const context: any = createCodegenContext();
  const { push } = context;
  push('return ');
  const functionName = 'render';
  const args = ['_ctx', '_cache'];
  const signature = args.join(', ');

  push(`funciton ${functionName}(${signature}){`);
  push('return');
  genNode(ast.codegenNode, context);
  push('}');

  return {
    code: context.code,
  };
}
function genNode(node: any, context: any) {
    console.log(node.content, "---------", node)
  const { push } = context;
  push(`'${node.content}'`);
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: any) {
      context.code += source;
    },
  };
  return context;
}
