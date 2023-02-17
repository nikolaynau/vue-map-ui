import { isEmpty, lcFirst } from './strings';

export function getEventsFromAttrs(
  attrs: Record<string, unknown>,
  exclude: string[] = []
): string[] {
  const result = [];
  for (const key in attrs) {
    if (key.startsWith('on') && typeof attrs[key] === 'function') {
      const eventName = lcFirst(key.slice(2));
      if (!isEmpty(eventName) && !exclude.includes(eventName)) {
        result.push(eventName);
      }
    }
  }
  return result;
}

export function getPropsFromAttrs(
  attrs: Record<string, unknown>,
  exclude: string[] = []
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in attrs) {
    if (
      !(key.startsWith('on') && typeof attrs[key] === 'function') &&
      !exclude.includes(key)
    ) {
      result[key] = attrs[key];
    }
  }
  return result;
}

export function getAttrs(
  attrs: Record<string, unknown>,
  { include, exclude }: { include?: string[]; exclude?: string[] }
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (include) {
    for (const key of include) {
      if (!exclude?.includes(key)) {
        result[key] = attrs[key];
      }
    }
  } else if (exclude) {
    for (const key in attrs) {
      if (!exclude.includes(key)) {
        result[key] = attrs[key];
      }
    }
  }
  return result;
}
