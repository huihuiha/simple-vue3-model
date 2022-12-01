import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObjct(raw, baseHandler) {
  return new Proxy(raw, baseHandler);
}

export function reactive(raw: Record<string, any>) {
  return createActiveObjct(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObjct(raw, readonlyHandlers);
}
