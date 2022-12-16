import { camelize, toHandlerKey } from "@simple-vue3-model/shared";

export function emit(instance: any, event: any, ...args: any[]) {
  //   instance.props -> props
  const { props } = instance;
  // 处理 add-foo -> addFoo 这种写法

  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
