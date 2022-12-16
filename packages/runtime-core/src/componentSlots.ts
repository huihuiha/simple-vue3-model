import { ShapeFlags } from '@simple-vue3-model/shared';

export function initSlots(instance: any, children: any) {
  // slots
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const value = children[key];
    // slot
    slots[key] = (props: any) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value];
}
