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
