import { ReactiveEffect } from '@simple-vue3-model/reactivity';
import { queuePreFlushCb } from './scheduler';

export function watchEffect(source: any) {
  function job() {
    effect.run();
  }

  let cleanup: any;

  const onCleanup = function (fn: any) {
    cleanup = effect.onStop = () => {
      fn();
    };
  };

  function getter() {
    if (cleanup) {
      cleanup();
    }
    source(onCleanup);
  }

  const effect = new ReactiveEffect(getter, () => {
    queuePreFlushCb(job);
  });

  effect.run();

  return () => {
    effect.stop();
  };
}
