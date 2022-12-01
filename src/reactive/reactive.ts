import { mutableHandlers, readonlyHandlers } from './baseHandlers';

function createActiveObjct(raw, baseHandler) {
  return new Proxy(raw, baseHandler);
}

export function reactive(raw: Record<string, any>) {
  return createActiveObjct(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObjct(raw, readonlyHandlers);
}
