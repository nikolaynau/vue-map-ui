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
