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

  describe('element', () => {
    it('简单的div', () => {
      const ast = baseParse('<div></div>');
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: [],
      });
    });
  });

  describe('text', () => {
    it('简单的text', () => {
      const ast = baseParse('some text');
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'some text',
      });
    });
  });

  test('三种类型', () => {
    const ast = baseParse('<div>h1,{{message}}</div>');
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.TEXT,
          content: 'h1,',
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    });
  });

  test('三种类型-复杂一点', () => {
    const ast = baseParse('<div><p>hi</p>{{message}}</div>');
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeTypes.TEXT,
              content: 'hi',
            },
          ],
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    });
  });

  test('三种类型-缺少结束标签的时候，抛出错误', () => {
    expect(() => {
      baseParse('<div><span></div>');
    }).toThrow(`缺少结束标签：span`);
  });
});
