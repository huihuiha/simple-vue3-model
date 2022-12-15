import { NodeTypes } from './ast';
import { helperMapName, TO_DISPLAY_STRING } from './runtimehelpers';

export function generate(ast: any) {
  const context: any = createCodegenContext();
  const { push } = context;

  genFunctionPreamble(ast, context);

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
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      geninterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    default:
      break;
  }
}

function genText(node: any, context: any) {
  const { push } = context;
  push(`'${node.content}'`);
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: any) {
      context.code += source;
    },
    helper(key: string) {
      return `_${helperMapName[key]}`
    }
  };
  return context;
}
function genFunctionPreamble(ast: any, context: any) {
  const { push } = context;
  const VueBinging = 'Vue';
  const aliasHelper = (s: string) => `${helperMapName[s]}: _${helperMapName[s]}`;
  if (ast.helpers.length > 0) {
    push(`const {${ast.helpers.map(aliasHelper).join(', ')}} = ${VueBinging}`);
  }
  push('\n');
  push('return ');
}
function geninterpolation(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(')');
}

function genExpression(node: any, context: any) {
  const {push} = context;

  push(`${node.content}`);
}
