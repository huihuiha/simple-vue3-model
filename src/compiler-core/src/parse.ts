import { NodeTypes } from './ast';

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context, []));
}

function parseInterpolation(context: any) {
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

function parseChildren(context: any, ancestors: any) {
  const nodes: any = [];

  while (!isEnd(context, ancestors)) {
    let node: any;
    const s = context.source;
    if (s.startsWith('{{')) {
      // 解析插值
      node = parseInterpolation(context);
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        // 解析 element 元素
        node = parseElement(context, ancestors);
      }
    }

    // 解析文本
    if (!node) {
      node = parseText(context);
    }

    nodes.push(node);
  }

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

function parseElement(context: any, ancestors: any) {
  // 1.解析tag
  const element: any = parseTag(context, TagType.Start);
  console.log(ancestors, "--------------")
  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error(`缺少结束标签：${element.tag}`);
  }

  return element;
}

function parseTag(context: any, type: TagType) {
  // 1.解析 tag，例如div
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  if (!match) return;
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagType.End) return;
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}
function parseText(context: any): any {
  let endIndex = context.source.length;
  let endTokens = ['<', '{{'];

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index !== -1 && endIndex > index) endIndex = index;
  }

  // 1.获取当前内容
  const content = parseTextData(context, endIndex);
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

function isEnd(context: any, ancestors: any) {
  // 2.遇到结束标签
  const s = context.source;

  if (s.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag;
      if (startsWithEndTagOpen(s, tag)) {
        return true;
      }
    }
  }

  // 1.source没值的时候结束
  return !s;
}

function startsWithEndTagOpen(source: any, tag: any) {
  return (
    source.startsWith("</") &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  );
}
