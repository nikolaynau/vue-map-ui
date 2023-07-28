import { camelize } from 'vue';

export { default as pick } from 'object.pick';
export { default as omit } from 'object.omit';

export function camelizeKeys(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    result[camelize(key)] = obj[key];
  }
  return result;
}

export function defineGetter(obj: unknown, key: string, fn: () => unknown) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: fn
  });
}
