export * from './toDisplayString';
export const extend = Object.assign;

export const isObject = (val: any) => {
  return val !== null && typeof val === 'object';
};

export const isString = (val: any) => {
  return typeof val === 'string';
};

export const hasChanged = (val: any, newVal: any) => {
  return !Object.is(val, newVal);
};

export const hasOwn = (val: any, key: string) =>
  Object.prototype.hasOwnProperty.call(val, key);

export const camelize = (str: string): any => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : '';
  });
};
// 首字母大写
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// 前面添加on
export const toHandlerKey = (str: string) => {
  return str ? `on${capitalize(str)}` : '';
};

export const EMPTY_OBJ = {};

export { ShapeFlags } from "./shapeFlags";
