import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObjct(raw: any, baseHandler: any): any {
  return new Proxy(raw, baseHandler);
}

export function reactive(raw: Record<string, any>) {
  return createActiveObjct(raw, mutableHandlers);
}

export function readonly(raw: any) {
  return createActiveObjct(raw, readonlyHandlers);
}

export function shallowReadonly(raw: any) {
  return createActiveObjct(raw, shallowReadonlyHandlers);
}
