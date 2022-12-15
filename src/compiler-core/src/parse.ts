import { NodeTypes } from './ast';

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context));
}

function parseInterpolation(context) {
  // 解析 {{message}}

  const openDelimiter = '{{';
  const closeDelimiter = '}}';

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  // 推进
  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;

  const rawContent = parseTextData(context, rawContentLength);

  // 去除空格
  const content = rawContent.trim();

  advanceBy(context, rawContentLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function parseChildren(context: any) {
  const nodes: any = [];

  let node: any;
  const s = context.source;
  if (s.startsWith('{{')) {
    // 解析插值
    node = parseInterpolation(context);
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      // 解析 element 元素
      node = parseElement(context);
    }
  }

  // 解析文本
  if (!node) {
    node = parseText(context);
  }

  nodes.push(node);

  return nodes;
}

function createRoot(children: any) {
  return {
    children,
  };
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function parseElement(context: any) {
  // 1.解析tag
  const element = parseTag(context, TagType.Start);
  parseTag(context, TagType.End);
  return element;
}

function parseTag(context: any, type: TagType) {
  // 1.解析 tag，例如div
  const match = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  // 2.删除处理后代码
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagType.End) return;
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}
function parseText(context: any): any {
  // 1.获取当前内容
  const content = parseTextData(context, context.source.length);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: any, length: number) {
  const content = context.source.slice(0, length);
  // 推进
  advanceBy(context, content.length);

  return content;
}
