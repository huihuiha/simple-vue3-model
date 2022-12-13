import { NodeTypes } from '../src/ast';
import { baseParse } from '../src/parse';
describe('Parse', () => {
  describe('插值', () => {
    test('最基本的插值', () => {
      const ast = baseParse('{{message}}');
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message',
        },
      });
    });
  });
});
