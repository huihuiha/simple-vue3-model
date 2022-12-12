import { createRenderer } from '../runtime-core/renderer';

function createElement(type: string) {
  return document.createElement(type);
}

function patchProp(el: any, key: any, prevVal: any, nextVal: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(child: any, parent: any, anchor: any) {
  // parent.append(el);
  parent.insertBefore(child, anchor || null);
}

function remove(child: any) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el: any, text: any) {
  el.textContent = text;
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args: any[]) {
  return renderer.createApp(...args);
}

export * from '../runtime-core/index';
