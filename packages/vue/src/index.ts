export * from '@simple-vue3-model/runtime-dom';
import { baseCompile } from '@simple-vue3-model/compiler-core';
import * as runtimeDom from '@simple-vue3-model/runtime-dom';
import { registerRuntimeCompiler } from '@simple-vue3-model/runtime-dom';

export function compileToFcuntion(template: any) {
  console.log(template);
  const { code } = baseCompile(template);
  const render = new Function('Vue', code)(runtimeDom);
  return render;
}

registerRuntimeCompiler(compileToFcuntion);
