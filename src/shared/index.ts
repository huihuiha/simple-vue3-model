export const extend = Object.assign;

export const isObject = (val: any) => {
  return val !== null && typeof val === 'object';
};

export const hasChanged = (val: any, newVal: any) => {
  return !Object.is(val, newVal);
};

export const hasOwn = (val: any, key: string) => Object.prototype.hasOwnProperty.call(val, key);